// utils/createOrder.ts
import { supabase } from "@/utils/supabase/server";

export interface CartItem {
  title: string;
  color?: string;
  size?: string;
  qty: number;
  price: number;
}

export interface OrderData {
  fullName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  cart: CartItem[];
}

export interface Order {
  id: string;
  created_at: string;
  status: "pagado" | "pendiente";
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  items: CartItem[];
}

/**
 * Crea un pedido y sus items en Supabase, vinculado por email
 * @param orderData - Datos del pedido y carrito
 */
export const createOrder = async (orderData: OrderData) => {
  try {
    // Insertar pedido principal
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          full_name: orderData.fullName,
          email: orderData.email, // vinculamos por email
          phone: orderData.phone || null,
          address: orderData.address,
          city: orderData.city,
          status: "pendiente",
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      throw orderError || new Error("No se pudo crear el pedido");
    }

    // Insertar items del carrito
    const cartItems = orderData.cart.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { data: cartData, error: itemsError } = await supabase
      .from("order_items")
      .insert(cartItems)
      .select();

    if (itemsError) throw itemsError;

    order.cart = cartData
    return { order }; // retornamos el pedido creado
  } catch (error) {
    console.error("Error creando pedido:", error);
    throw error;
  }
};

export const getOrdersByEmail = async (email: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, created_at, status, full_name, email, phone, address, city, order_items(id, title, color, size, qty, price)"
    )
    .eq("email", email)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((o: any) => ({
    id: o.id,
    created_at: o.created_at,
    status: o.status,
    full_name: o.full_name,
    email: o.email,
    phone: o.phone,
    address: o.address,
    city: o.city,
    items: o.order_items || [],
  }));
};

export const listAllOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, created_at, status, full_name, email, phone, address, city, order_items(id, title, color, size, qty, price)"
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((o: any) => ({
    id: o.id,
    created_at: o.created_at,
    status: o.status,
    full_name: o.full_name,
    email: o.email,
    phone: o.phone,
    address: o.address,
    city: o.city,
    items: o.order_items || [],
  }));
};

export const updateOrderStatus = async (
  id: string,
  status: Order["status"],
) => {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
};
