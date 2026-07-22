import { getCustomerById } from "@/lib/api";
import { Ban } from "lucide-react";
import Link from "next/link";
import { CustomerProfileClient } from "./client";

export default async function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const res = await getCustomerById(id);

  if (!res || !res.customer) {
    return (
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <Ban size={48} className="text-gray-300 dark:text-gray-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Customer Not Found</h2>
          <p className="text-sm text-gray-500 mt-1">This customer does not exist or has been removed.</p>
        </div>
        <Link href="/admin/customers" className="mt-2 text-brand-cobalt hover:underline text-sm font-semibold">
          Back to Customers
        </Link>
      </div>
    );
  }

  return <CustomerProfileClient customer={res.customer} customerOrders={res.recentOrders} />;
}
