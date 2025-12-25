import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ContactInfo {
  email: string | null;
  phone: string | null;
  address: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
}

const defaultContactInfo: ContactInfo = {
  email: "listeningtomannkibaat@gmail.com",
  phone: null,
  address: null,
  instagram_url: "https://instagram.com",
  linkedin_url: null,
};

export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("contact_info")
        .select("*")
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setContactInfo({
          email: data.email || defaultContactInfo.email,
          phone: data.phone || defaultContactInfo.phone,
          address: data.address || defaultContactInfo.address,
          instagram_url: data.instagram_url || defaultContactInfo.instagram_url,
          linkedin_url: data.linkedin_url || defaultContactInfo.linkedin_url,
        });
      }
    } catch (err) {
      console.error("Error fetching contact info:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch contact info'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  return {
    contactInfo,
    loading,
    error,
    refresh: fetchContactInfo,
  };
};
