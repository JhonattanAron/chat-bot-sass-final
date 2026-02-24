"use server";

import axios from "axios";
import { env } from "@/env";

export interface ConfirmPaymentResponse {
  email: string;
  cardType: string;
  bin: string;
  lastDigits: string;
  deferredCode: string;
  deferred: boolean;
  cardBrandCode: string;
  cardBrand: string;
  amount: number;
  clientTransactionId: string;
  phoneNumber: string;
  statusCode: number;
  transactionStatus: string;
  authorizationCode: string;
  message: string | null;
  messageCode: number;
  transactionId: number;
  document: string;
  currency: string;
  optionalParameter3: string;
  optionalParameter4: string;
  storeName: string;
  date: string;
  regionIso: string;
  transactionType: string;
  reference: string;
}

export async function confirmPayment(
  id: string | number,
  clientTxId: string,
): Promise<{
  success: boolean;
  data?: ConfirmPaymentResponse;
  error?: string;
}> {
  const token = env.PAYPHONE_TOKEN;

  console.log({
    data: {
      id,
      clientTxId,
      token,
    },
  });

  if (!token) {
    return {
      success: false,
      error: "Token de API de Payphone no configurado",
    };
  }

  try {
    const response = await axios.post<ConfirmPaymentResponse>(
      "https://pay.payphonetodoesposible.com/api/button/V2/Confirm",
      {
        id,
        clientTxId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          `Error en la solicitud: ${error.response?.status} ${error.response?.statusText}`,
      };
    }

    return {
      success: false,
      error: "Error desconocido al confirmar el pago",
    };
  }
}
