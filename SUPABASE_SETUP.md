# Supabase Setup for Updates

This guide will help you set up the Supabase database table for storing admin-published updates.

## Step 1: Create the Database Table

You need to run the SQL migration to create the `updates` table in your Supabase database.

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (in the left sidebar)
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/create_updates_table.sql`
5. Click **Run** to execute the SQL

### Option B: Using Supabase CLI

If you have Supabase CLI installed:

```bash
supabase db push
```

This will apply all migrations in the `supabase/migrations/` folder.

## Step 2: Verify the Table

After running the migration, verify that the table was created:

1. Go to **Table Editor** in your Supabase dashboard
2. You should see the `updates` table with the following columns:
   - `id` (bigserial, primary key)
   - `title` (text)
   - `content` (text)
   - `image` (text, nullable)
   - `is_warning` (boolean, default false)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

## Step 3: Test the Integration

1. Log in as admin (`galeliahu30@gmail.com`)
2. Go to the admin page
3. Click "פרסם עדכון חדש" and create a test update
4. Check that it appears in the "עדכונים" page for all users
5. Try deleting an update from the admin panel

## Row Level Security (RLS)

The migration sets up Row Level Security policies:
- **Public Read**: Anyone can read updates (all users can see them)
- **Authenticated Insert**: Only authenticated users can create updates
- **Authenticated Delete**: Only authenticated users can delete updates

If you want to restrict insert/delete to only the admin email, you can modify the policies in the Supabase dashboard under **Authentication > Policies**.

## Troubleshooting

If you encounter errors:

1. **"relation 'updates' does not exist"**: Make sure you ran the migration SQL
2. **"permission denied"**: Check that RLS policies are set up correctly
3. **Updates not appearing**: Check the browser console for errors and verify your Supabase connection

## Migration File Location

The SQL migration file is located at:
```
supabase/migrations/create_updates_table.sql
```

