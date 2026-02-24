// app/dashboard/inbox/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, AlertCircle } from 'lucide-react';

export default function InboxPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Inbox</h2>
        <p className="text-slate-400">View and manage received emails</p>
      </div>

      <Card className="border-yellow-700/50 bg-yellow-900/20">
        <CardHeader>
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <CardTitle className="text-yellow-400">Incoming Emails Not Available</CardTitle>
              <CardDescription className="text-yellow-700 mt-2">
                Resend API does not currently provide a built-in endpoint for receiving/listing incoming emails. This is because Resend is primarily a transactional email service for sending.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-300">
          <div>
            <h4 className="font-semibold text-white mb-2">Alternative Solutions:</h4>
            <ul className="space-y-2 ml-4 list-disc">
              <li>Use <span className="text-blue-400">webhooks</span> to capture bounce, delivery, and complaint events</li>
              <li>Integrate with <span className="text-blue-400">Resend Domains</span> for SMTP configuration and incoming mail setup</li>
              <li>Connect your own email account via IMAP to pull incoming emails</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">For Now:</h4>
            <p>Navigate to your <span className="text-blue-400 font-medium">Email History</span> to see all emails you've sent, or visit the <span className="text-blue-400 font-medium">Domains</span> section to set up incoming email routing.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 border-slate-700 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="text-white">How to Set Up Incoming Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-300">
          <div>
            <h4 className="font-semibold text-white mb-2">Option 1: Configure MX Records</h4>
            <p className="text-slate-400">Set up MX records for your domain to route incoming emails to your email server or use Resend Domains for SMTP relay.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Option 2: Use Webhooks</h4>
            <p className="text-slate-400">Implement webhooks to track email events (bounces, delivery confirmations, complaints) in real-time.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Option 3: IMAP Integration</h4>
            <p className="text-slate-400">Connect your email account via IMAP protocol to sync incoming emails to this dashboard.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
