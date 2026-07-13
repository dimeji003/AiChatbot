



import ActionCards from "../components/user-management/ActionCards";
import Header from "../components/user-management/Header";
import LoginHistory from "../components/user-management/LoginHistory";
import ModuleAccessMatrix from "../components/user-management/ModuleAccessMatrix";
import StakeholderMatrix from "../components/user-management/StakeholderMatrix";
import StatsCards from "../components/user-management/StatsCards";
import TokenMonitor from "../components/user-management/TokenMonitor";
import ViolationLog from "../components/user-management/ViolationLog";


export default function UserManagement() {
  return (
    <div className="space-y-6">
      <Header />
      <StatsCards />


      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <StakeholderMatrix />
          <ModuleAccessMatrix />
          <LoginHistory />
          <ActionCards />
        </div>

        <div className="xl:col-span-4 space-y-6">
          <TokenMonitor />
          <ViolationLog />
        </div>
      </div>
    </div>
  );
}