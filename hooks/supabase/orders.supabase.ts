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
