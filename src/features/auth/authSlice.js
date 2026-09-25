import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clearAdminTisTokens, isAdminTisAuthed, loginAdminTis } from '../../shared/api/adminTisApi';

// ── Thunks ────────────────────────────────────────────────────────

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    // 1) Asosiy login — admin.tisedu.uz (majburiy). Kira olmasa, umuman kiritmaymiz.
    try {
      await loginAdminTis(username, password);
    } catch (err) {
      clearAdminTisTokens();
      const detail = err.response?.data?.detail;
      return rejectWithValue(
        typeof detail === 'string' && err.response?.status !== 401
          ? detail
          : "Login yoki parol noto'g'ri (admin.tisedu.uz)",
      );
    }

    // school.gennis.uz'ga so'rov yuborilmaydi — hamma narsa admin.tisedu.uz orqali.
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return { access: null, refresh: null };
  },
);

// admin.tisedu.uz (new-turon) — yangiliklar/kategoriyalar shu yerda saqlanadi.
// Faqat yangiliklarni tahrirlash uchun kerak, shuning uchun muvaffaqiyatsiz
// bo'lsa ham asosiy loginThunk'ni to'xtatmaydi: har bir filial admini bu
// akkauntga ega bo'lmasligi mumkin, ega bo'lmasa yangiliklar bo'limi
// tahrirlashda "ruxsat yo'q" xabarini ko'rsatadi.
export const loginAdminTisThunk = createAsyncThunk(
  'auth/loginAdminTis',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await loginAdminTis(username, password);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Admin tis login failed');
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────

const initialState = {
  accessToken: localStorage.getItem('access_token') || null,
  refreshToken: localStorage.getItem('refresh_token') || null,
  isAuth: !!localStorage.getItem('access_token') || isAdminTisAuthed(),
  adminTisAuthed: isAdminTisAuthed(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuth = false;
      state.adminTisAuthed = false;
      state.error = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      clearAdminTisTokens();
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── login ──
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.accessToken = payload.access;
        state.refreshToken = payload.refresh;
        state.isAuth = true;
        state.adminTisAuthed = true;
      })
      .addCase(loginThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ── login (admin.tisedu.uz) — best-effort, xatosi asosiy login'ga ta'sir qilmaydi ──
    builder
      .addCase(loginAdminTisThunk.fulfilled, (state) => {
        state.adminTisAuthed = true;
      })
      .addCase(loginAdminTisThunk.rejected, (state) => {
        state.adminTisAuthed = false;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────
export const selectAuth = (state) => state.auth;
export const selectIsAuth = (state) => state.auth.isAuth;
export const selectIsAdminTisAuthed = (state) => state.auth.adminTisAuthed;

export default authSlice.reducer;
