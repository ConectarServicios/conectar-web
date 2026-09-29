alter table public.conectar_play_settings
add column onn_rental_two_price numeric(12,2)
check (onn_rental_two_price >= 0);
