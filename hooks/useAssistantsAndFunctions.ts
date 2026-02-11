'use client';

import { useChatAssistantStore } from "@/store/chatAsistantStore";
import { useAuthStore } from "@/store/AuthStore";
import { useEffect, useState } from "react";
import { ChatAssistant } from "@/store/chatAsistantStore";
import { useFunctionsStore, AssistantFunction } from "@/store/functionsStore";

export function useAssistantsAndFunctions(assistantId: string) {
  const { user } = useAuthStore();
  const {
    assistants,
    assistant,
    loading: assistantsLoading,
    error: assistantsError,
    getAssistants,
    getAssistantById,
    createAssistant,
    updateAssistant,
    deleteAssistant,
  } = useChatAssistantStore();

  const {
    functions,
    loading: functionsLoading,
    error: functionsError,
    fetchFunctions,
    addFunction,
    updateFunction,
    deleteFunction,
  } = useFunctionsStore();

  const [isAssistantsInitialized, setIsAssistantsInitialized] = useState(false);
  const [isFunctionsInitialized, setIsFunctionsInitialized] = useState(false);

  useEffect(() => {
    if (user?.id && !isAssistantsInitialized) {
      getAssistants(user.id);
      setIsAssistantsInitialized(true);
    }
  }, [user?.id, isAssistantsInitialized]);

  useEffect(() => {
    if (user?.id && assistantId && !isFunctionsInitialized) {
      fetchFunctions(user.id, assistantId);
      setIsFunctionsInitialized(true);
    }
  }, [user?.id, assistantId, isFunctionsInitialized]);

  const handleCreateAssistant = async (assistantData: Omit<ChatAssistant, "_id">) => {
    try {
      const result = await createAssistant({
        ...assistantData,
        user_id: user?.id || "",
      });
      return result;
    } catch (err) {
      console.error("Error creating assistant:", err);
      throw err;
    }
  };

  const handleUpdateAssistant = async (
    assistantId: string,
    updates: Partial<ChatAssistant>
  ) => {
    try {
      await updateAssistant(assistantId, updates);
    } catch (err) {
      console.error("Error updating assistant:", err);
      throw err;
    }
  };

  const handleDeleteAssistant = async (assistantId: string) => {
    try {
      await deleteAssistant(assistantId, user?.id || "");
    } catch (err) {
      console.error("Error deleting assistant:", err);
      throw err;
    }
  };

  const handleFetchAssistant = async (assistantId: string) => {
    try {
      await getAssistantById(assistantId, user?.id || "");
    } catch (err) {
      console.error("Error fetching assistant:", err);
      throw err;
    }
  };

  const handleAddFunction = async (func: AssistantFunction) => {
    try {
      const result = await addFunction(user?.id || "", assistantId, func);
      return result;
    } catch (err) {
      console.error("Error adding function:", err);
      throw err;
    }
  };

  const handleUpdateFunction = async (
    functionId: string,
    updates: Partial<AssistantFunction>
  ) => {
    try {
      const result = await updateFunction(
        user?.id || "",
        assistantId,
        functionId,
        updates
      );
      return result;
    } catch (err) {
      console.error("Error updating function:", err);
      throw err;
    }
  };

  const handleDeleteFunction = async (functionId: string) => {
    try {
      const result = await deleteFunction(user?.id || "", assistantId, functionId);
      return result;
    } catch (err) {
      console.error("Error deleting function:", err);
      throw err;
    }
  };

  return {
    assistants,
    currentAssistant: assistant,
    assistantsLoading,
    assistantsError,
    createAssistant: handleCreateAssistant,
    updateAssistant: handleUpdateAssistant,
    deleteAssistant: handleDeleteAssistant,
    fetchAssistant: handleFetchAssistant,
    fetchAllAssistants: () => getAssistants(user?.id || ""),
    functions,
    functionsLoading,
    functionsError,
    addFunction: handleAddFunction,
    updateFunction: handleUpdateFunction,
    deleteFunction: handleDeleteFunction,
    refetchFunctions: () => fetchFunctions(user?.id || "", assistantId),
  };
}
