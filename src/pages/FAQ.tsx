
import * as React from "react";

export default function FAQ() {
  const faqs = [
    {
      question: "Is Projobhub free to use?",
      answer: "Yes! Searching and applying to jobs is completely free for job seekers."
    },
    {
      question: "How do I get noticed by employers?",
      answer: "Fill out your profile completely, add relevant skills, and apply to jobs that match your expertise. Regular profile updates also help."
    },
    {
      question: "I forgot my password, what can I do?",
      answer: "Use the 'Forgot password' option on the login page to reset your password via email."
    },
    {
      question: "How does the real-time messaging work?",
      answer: "Our platform supports live messaging between users. When multiple people are online, you can chat instantly with employers and other users."
    },
    {
      question: "Can I post multiple jobs as an employer?",
      answer: "Yes! Use the Hiring section to post unlimited job listings. All your posted jobs are saved and can be managed from your dashboard."
    },
    {
      question: "How do I update my location for better job matches?",
      answer: "Click on the location dropdown in the navigation bar to set your current location or search for jobs in specific areas."
    },
    {
      question: "What types of employment are supported?",
      answer: "We support all types: Full-time, Part-time, Remote, Hybrid, Internships, Contract work, and Volunteering opportunities."
    },
    {
      question: "How do I filter jobs effectively?",
      answer: "Use the advanced filters on the jobs page to narrow down by salary range, work location, experience level, and job type."
    },
    {
      question: "Is my profile information secure?",
      answer: "Yes, we use enterprise-grade security with Supabase authentication to protect all user data and communications."
    },
    {
      question: "Can I edit or delete my job posts?",
      answer: "Currently, posted jobs are saved in your session. For permanent job management features, please contact our support team."
    },
    {
      question: "How do notifications work?",
      answer: "You'll receive notifications for new messages, job applications, and when employers view your profile."
    },
    {
      question: "What browsers are supported?",
      answer: "Projobhub works on all modern browsers including Chrome, Firefox, Safari, and Edge. Mobile browsers are fully supported."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto gradient-card rounded-2xl shadow-xl p-8 relative z-10">
      <h2 className="text-3xl font-bold mb-8 text-white text-center">Frequently Asked Questions</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="font-semibold text-white mb-3 text-lg">{faq.question}</h3>
            <p className="text-gray-200 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <p className="text-gray-300">
          Have more questions? Contact us through the Messages section or reach out to our support team.
        </p>
      </div>
    </div>
  );
}
