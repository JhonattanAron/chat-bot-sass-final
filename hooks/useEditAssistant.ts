"use client";

import { useCallback } from "react";
import { useEditAssistantStore } from "@/store/useEditAssistantStore";
import type { AssistantEditData } from "@/store/useEditAssistantStore";

export function useEditAssistant() {
  const {
    assistantData,
    loading,
    saving,
    error,
    success,
    fetchAssistantForEdit,
    updateAssistantBasicInfo,
    addFaq,
    updateFaqItem,
    deleteFaqItem,
    setError,
    clearState,
  } = useEditAssistantStore();

  const loadAssistant = useCallback(
    async (assistantId: string, userId: string) => {
      return await fetchAssistantForEdit(assistantId, userId);
    },
    [fetchAssistantForEdit]
  );

  const updateBasicInfo = useCallback(
    async (
      assistantId: string,
      userId: string,
      data: Partial<Omit<AssistantEditData, "_id" | "user_id" | "faqs">>
    ) => {
      return await updateAssistantBasicInfo(assistantId, userId, data);
    },
    [updateAssistantBasicInfo]
  );

  const addNewFaq = useCallback(
    async (
      assistantId: string,
      userId: string,
      faq: { question: string; answer: string; category: string }
    ) => {
      return await addFaq(assistantId, userId, faq);
    },
    [addFaq]
  );

  const editFaq = useCallback(
    async (
      assistantId: string,
      userId: string,
      faqId: string,
      faq: Partial<{ question: string; answer: string; category: string }>
    ) => {
      return await updateFaqItem(assistantId, userId, faqId, faq);
    },
    [updateFaqItem]
  );

  const removeFaq = useCallback(
    async (assistantId: string, userId: string, faqId: string) => {
      return await deleteFaqItem(assistantId, userId, faqId);
    },
    [deleteFaqItem]
  );

  return {
    // State
    assistantData,
    loading,
    saving,
    error,
    success,

    // Methods
    loadAssistant,
    updateBasicInfo,
    addNewFaq,
    editFaq,
    removeFaq,
    setError,
    clearState,
  };
}
