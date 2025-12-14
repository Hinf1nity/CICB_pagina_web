import { useState, useEffect } from "react";
import api from "../api/kyClient";

export interface Item {
  id: number;
  type: "yearbook" | "regulations" | "announcements";
  title: string;
  description: string;
  file: string;
}

export function useItems(type: "yearbook" | "regulations" | "announcements") {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        const response:Item[] = await api.get(type).json();

        setItems(response)

      } catch (error) {
        console.error("Error obteniendo datos:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [type]);

  return { items, loading };
}
