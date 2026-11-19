import { getAccounts } from "@/actions/accounts";
import { AccountModal } from "@/components/forms/account-modal";
import { AccountsTable } from "@/components/accounts-table";
import { PageHeader } from "@/components/ui/page-header";
import { checkAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccountsPage() {
  try {
    await checkAdmin();
  } catch {
    redirect("/");
  }

  const { data: accounts } = await getAccounts();

  return (
    <div className="space-y-5 md:space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="System Accounts"
        description="Manage portal credentials, administrator access, and resident login roles."
        action={<AccountModal />}
      />

      <AccountsTable accounts={accounts || []} />
    </div>
  );
}
