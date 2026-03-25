import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { FaQuestionCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
  {
    q: "How do I create a new task?",
    a: "Go to the Dashboard and click the '+ Add task' button in the To-Do section. Fill in the title, date, priority, description, and optionally upload an image.",
  },
  {
    q: "What are the priority levels?",
    a: "There are 3 priority levels: Extreme (red) for urgent tasks, Moderate (blue) for regular tasks, and Low (green) for non-urgent tasks. Extreme priority tasks also appear in the Vital Tasks section.",
  },
  {
    q: "How do I update a task's status?",
    a: "Click on any task card to open the task details page, then click the Edit button. You can change the status to 'Not Started', 'In Progress', or 'Completed'.",
  },
  {
    q: "How do I delete a task?",
    a: "Open the task by clicking on it, then click the red 'Delete' button in the top right of the task details page. You will be asked to confirm before it is deleted.",
  },
  {
    q: "Can I upload images to tasks?",
    a: "Yes! When creating or editing a task, you can drag & drop an image or click Browse to select one. Images are stored securely on Cloudinary.",
  },
  {
    q: "What is the Vital Task section?",
    a: "Vital Tasks shows only tasks with 'Extreme' priority — these are your most urgent tasks that need immediate attention.",
  },
  {
    q: "What is Task Categories?",
    a: "Task Categories groups all your tasks by priority level (Extreme, Moderate, Low) so you can see how your workload is distributed.",
  },
  {
    q: "Can I sign in with Google?",
    a: "Yes! On the Login or Signup page, click the Google button to sign in or create an account using your Google credentials. No password needed.",
  },
  {
    q: "Are my tasks private?",
    a: "Yes. Each user can only see their own tasks. Your data is secured with JWT authentication — no one else can access your tasks.",
  },
  {
    q: "How do I log out?",
    a: "Click the 'Logout' button at the bottom of the sidebar on any page.",
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`bg-white rounded-xl border transition-all ${open ? "border-red-200 shadow-sm" : "border-gray-100"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
      >
        <span className="text-sm font-semibold text-gray-800">{q}</span>
        {open
          ? <FaChevronUp className="text-red-400 text-xs flex-shrink-0" />
          : <FaChevronDown className="text-gray-400 text-xs flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
};

const Help = () => (
  <PageLayout>
    {/* Header */}
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
        <FaQuestionCircle className="text-yellow-500" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-800">Help & FAQ</h1>
        <p className="text-xs text-gray-400">Answers to common questions</p>
      </div>
    </div>

    {/* Quick tip banner */}
    <div className="bg-gradient-to-r from-red-500 to-orange-400 rounded-2xl p-5 mb-6 text-white">
      <p className="font-semibold text-sm mb-1">Quick tip</p>
      <p className="text-xs opacity-90">
        Click on any task card to view its details, edit it, or delete it. Use the sidebar to navigate between different views of your tasks.
      </p>
    </div>

    {/* FAQ list */}
    <div className="max-w-2xl space-y-2">
      {faqs.map((item, i) => (
        <FAQItem key={i} q={item.q} a={item.a} />
      ))}
    </div>
  </PageLayout>
);

export default Help;
