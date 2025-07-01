import "./globals.css";
import ClientLayout from "@/utilities/ClientLayout";
import { AuthProvider } from "@/utilities/AuthContext";
import { CartProvider } from "@/utilities/CartContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Wajeeha Couture",
  description: "Wajeeha Couture - Your Fashion Destination",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
        <ClientLayout>
          {children}
              <Toaster position="top-center" />
        </ClientLayout>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
