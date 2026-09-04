import { getAccounts } from "@/actions/accounts";
import { AccountModal } from "@/components/forms/account-modal";
import { AccountActions } from "@/components/forms/account-actions";
import { auth, checkAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccountsPage() {
  try {
    await checkAdmin();
  } catch (e) {
    redirect("/");
  }

  const { data: accounts } = await getAccounts();
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col">
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
          System Accounts
        </h1>
        <p className="text-gray-500 mt-2">Manage login credentials and roles for dormitory members.</p>
        <AccountModal />
      </div>
      
      <div className="rounded-2xl bg-white/50 dark:bg-black/20 p-1">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50">Name</th>
              <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50">Email</th>
              <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50">Role</th>
              <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50 text-right">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-500 border-b border-gray-200/50 dark:border-gray-800/50 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
            {accounts?.map((account) => (
              <tr key={account.id} className="group hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{account.name || "N/A"}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{account.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                    account.role === 'ADMIN' 
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]' 
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  }`}>
                    {account.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <AccountActions account={account} />
                </td>
              </tr>
            ))}
            {(!accounts || accounts.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-lg font-medium mb-1">No accounts found</p>
                    <p className="text-sm">Click the floating button to create a user.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
