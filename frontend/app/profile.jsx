import useAuth from "@/hooks/useAuth";
import CustomerProfile from "../components/customerProfile";
import AdminProfile from "../components/adminProfile";

export default function Profile() {
  const { role } = useAuth();

  return <>{role === "admin" ? <AdminProfile /> : <CustomerProfile />}</>;
}
