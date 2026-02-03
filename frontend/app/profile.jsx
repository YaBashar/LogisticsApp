import useAuth from "@/hooks/useAuth";
import CustomerProfile from "../components/customerProfile";
import AdminProfile from "../components/adminProfile";
import usePushNotifs from "../hooks/usePushNotifs";

export default function Profile() {
  const { role } = useAuth();
  usePushNotifs();

  return <>{role === "admin" ? <AdminProfile /> : <CustomerProfile />}</>;
}
