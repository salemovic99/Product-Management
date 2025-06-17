'use server'

import { revalidatePath } from "next/cache"
import { checkRole } from "../../../utils/roles"
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function setRole(formData: FormData) {
  const { sessionClaims } = await auth()
  
  
  if (sessionClaims?.metadata.role !== 'admin') {
    return
  }
  
  const client = await clerkClient()

  try {
    const res = await client.users.updateUserMetadata(formData.get('id') as string, {
      publicMetadata: { role: formData.get('role') },
    })
    revalidatePath('/admin');
    
  } catch (err) {
    throw new Error(err)
  }
}

export async function removeRole(formData: FormData) {
  const { sessionClaims } = await auth()
  
  
  if (sessionClaims?.metadata.role !== 'admin') {
    return
  }
  
  const client = await clerkClient()

  try {
    const res = await client.users.updateUserMetadata(formData.get('id') as string, {
      publicMetadata: { role: null },
    })
    revalidatePath('/admin');
    // return { message: res.publicMetadata }
  } catch (err) {
    throw new Error(err)
  }
}