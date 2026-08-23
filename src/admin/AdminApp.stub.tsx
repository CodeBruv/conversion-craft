/**
 * Production stand-in for the local content editor.
 *
 * vite.config.ts aliases "@/admin/AdminApp" to this file for production builds,
 * so the real editor, its form, and its calls to the dev writer are never part
 * of the shipped bundle. Anyone who requests /admin on the live site gets the
 * ordinary 404 page.
 */
import NotFound from "@/pages/NotFound";

const AdminApp = () => <NotFound />;

export default AdminApp;
