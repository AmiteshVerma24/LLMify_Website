import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]/route';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(200).json({ authenticated: false });
  }

  const resp = await fetch(`${process.env.GO_BACKEND_URL}/api/extension/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.GO_BACKEND_API_KEY ?? '',
    },
    body: JSON.stringify({
      email: session.user.email,
      name: session.user.name,
      extensionId: req.body.extensionId,
      instanceId: req.body.instanceId,
    }),
  });

  const data = await resp.json();
  return res.status(resp.status).json(data);
}