# ⚡ Quick Start Guide

Get MPP Pandeglang Service Finder running in 10 minutes!

## 📋 Prerequisites

- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Supabase account (free at [supabase.com](https://supabase.com))
- [ ] Gemini API key (free at [aistudio.google.com](https://aistudio.google.com/app/apikey))

## 🚀 5-Step Setup

### Step 1: Clone & Install (2 min)

```bash
# Clone the repository
git clone <your-repo-url>
cd mpp-pandeglang-service-finder

# Install dependencies
npm install
```

### Step 2: Setup Supabase (3 min)

1. **Create Project**
   - Go to [supabase.com/dashboard](https://app.supabase.com)
   - Click "New Project"
   - Name: `mpp-pandeglang`
   - Choose region: Southeast Asia (Singapore)
   - Wait ~2 minutes for setup

2. **Run Database Schema**
   - In Supabase Dashboard, click "SQL Editor"
   - Click "New Query"
   - Copy entire content of `supabase/schema.sql`
   - Paste and click "Run"
   - Wait for "Success" message

3. **Add Seed Data**
   - Still in SQL Editor, create new query
   - Copy entire content of `supabase/seed.sql`
   - Paste and click "Run"
   - Verify: Click "Table Editor" - you should see 5 agencies

### Step 3: Get API Credentials (2 min)

**Supabase:**
1. In Supabase Dashboard, click Settings (gear icon)
2. Click "API" in sidebar
3. Copy:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - anon/public key (long string)

**Gemini:**
1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key

### Step 4: Configure Environment (1 min)

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your favorite editor
# Replace these values:
```

```env
GEMINI_API_KEY=your_actual_gemini_key_here
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_actual_supabase_anon_key_here
```

### Step 5: Run & Test (2 min)

```bash
# Verify setup
npm run check-setup

# If all checks pass, start the app
npm run dev
```

Open browser to `http://localhost:3000`

## ✅ Verification Checklist

Test these features to confirm everything works:

### User Mode
- [ ] Page loads without errors
- [ ] Service grid shows 5 agencies
- [ ] Click on a service shows modal with details
- [ ] Type in chat and get AI response
- [ ] Quick category buttons work

### Admin Mode
- [ ] Press `Ctrl+Shift+A` (or `Cmd+Shift+A` on Mac)
- [ ] Login with `admin` / `password123`
- [ ] Dashboard loads with agencies list
- [ ] Add new agency works
- [ ] Add new service works
- [ ] Edit service works
- [ ] Delete service works
- [ ] Refresh page - data persists ✨
- [ ] Analytics tab shows data
- [ ] Profile tab loads MPP info

## 🎉 Success!

If all checks pass, you're ready to go!

## 🔧 Common Issues

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### "Invalid API key"
- Check `.env.local` has correct values
- No spaces before/after the `=`
- Restart dev server after changing `.env.local`

### "relation does not exist"
- Schema not run correctly
- Go back to Step 2 and re-run `schema.sql`

### Data doesn't persist
- Check browser console (F12) for errors
- Verify Supabase credentials in `.env.local`
- Check Supabase Dashboard > Logs for errors

### Build fails
```bash
# Clear everything and start fresh
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📚 Next Steps

### Immediate
1. **Change admin password**
   - Login as admin
   - Go to "Profil MPP" tab
   - Change password section

2. **Customize MPP Profile**
   - Update operating hours
   - Add contact information
   - Update social media links

3. **Add your agencies**
   - Add local government agencies
   - Add their services
   - Upload agency logos

### Learning More
- Read [README.md](./README.md) for full documentation
- Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for advanced setup
- Review [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for code details

## 🆘 Need Help?

1. **Check documentation**
   - README.md - Overview
   - SUPABASE_SETUP.md - Detailed setup
   - MIGRATION_GUIDE.md - Code changes
   - REFACTORING_SUMMARY.md - What changed

2. **Check logs**
   - Browser console (F12)
   - Supabase Dashboard > Logs
   - Terminal where `npm run dev` is running

3. **Verify setup**
   ```bash
   npm run check-setup
   ```

4. **Common fixes**
   ```bash
   # Restart dev server
   Ctrl+C
   npm run dev
   
   # Clear cache
   rm -rf node_modules package-lock.json
   npm install
   ```

## 🎯 Production Deployment

Ready to deploy? Follow these steps:

### 1. Build
```bash
npm run build
```

### 2. Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### 3. Or deploy to Netlify
```bash
# Build creates 'dist' folder
npm run build

# Drag 'dist' folder to Netlify
# Add environment variables in Netlify dashboard
```

### 4. Security Checklist
- [ ] Change default admin password
- [ ] Set strong passwords for all users
- [ ] Enable HTTPS (automatic on Vercel/Netlify)
- [ ] Setup database backups in Supabase
- [ ] Monitor usage in Supabase Dashboard

## 📊 Default Data

After seed, you'll have:
- **5 Agencies**: Dukcapil, SAMSAT, Imigrasi, Polres, BPJS
- **8 Services**: KTP, KK, STNK, Paspor, SKCK, BPJS registration
- **1 Admin User**: username `admin`, password `password123`
- **1 MPP Profile**: Default Pandeglang info
- **10 Sample Chat Logs**: For analytics demo

## 🎊 You're All Set!

Enjoy your new AI-powered service finder!

---

**Time to complete**: ~10 minutes  
**Difficulty**: Easy  
**Support**: Check documentation or open an issue

Happy coding! 🚀
