-- Add booking status fields to events table
ALTER TABLE public.events
ADD COLUMN is_booking_open boolean DEFAULT true,
ADD COLUMN slots_status text DEFAULT NULL;

COMMENT ON COLUMN public.events.is_booking_open IS 'Controls whether bookings are open for this event';
COMMENT ON COLUMN public.events.slots_status IS 'Custom status message like "Slots Full" or "Limited Seats"';

-- Insert default WhatsApp contact setting
INSERT INTO public.settings (key, value)
VALUES ('whatsapp_contact', '1234567890')
ON CONFLICT (key) DO NOTHING;