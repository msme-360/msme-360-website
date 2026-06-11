from supabase import create_client, Client
from app.config import settings

def get_supabase_client() -> Client:
    """
    Returns a Supabase client initialized with the service role key.
    This client bypasses RLS.
    """
    return create_client(settings.NEXT_PUBLIC_SUPABASE_URL, settings.SUPABASE_SECRET_KEY)

supabase: Client = get_supabase_client()
