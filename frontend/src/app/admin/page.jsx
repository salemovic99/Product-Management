import { redirect } from 'next/navigation'
import { checkRole } from '../../../utils/roles'
import { SearchUsers } from './SearchUsers'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { removeRole, setRole } from './_actions'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Shield, Users, Settings, Crown, User, UserMinus } from 'lucide-react'
import { Separator } from '../../components/ui/separator'

export default async function AdminDashboard() {
  const { sessionClaims } = await auth()
     
  if (sessionClaims?.metadata.role !== 'admin') {
    redirect('/dashboard') // Not admin, redirect home
  }
  
  const client = await clerkClient()
  const users = (await client.users.getUserList()).data
  
  const adminCount = users.filter(user => user.publicMetadata.role === 'admin').length
  const memberCount = users.filter(user => user.publicMetadata.role === 'member').length
  const noRoleCount = users.filter(user => !user.publicMetadata.role).length

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return (
        <Badge variant="default" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <Crown className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      )
    }
    if (role === 'member') {
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          <User className="w-3 h-3 mr-1" />
          Member
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-gray-500">
        <UserMinus className="w-3 h-3 mr-1" />
        No Role
      </Badge>
    )
  }

  const getUserInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0) || ''
    const last = lastName?.charAt(0) || ''
    return (first + last).toUpperCase() || 'U'
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions across your application
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Crown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{adminCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{memberCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Role</CardTitle>
            <UserMinus className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">{noRoleCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>User Management</span>
          </CardTitle>
          <CardDescription>
            View and manage user roles and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      User
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Email
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Role
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const email = user.emailAddresses.find(
                      (email) => email.id === user.primaryEmailAddressId
                    )?.emailAddress;
                    
                    return (
                      <tr key={user.id} className={index !== users.length - 1 ? "border-b" : ""}>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={user.imageUrl} alt={`${user.firstName} ${user.lastName}`} />
                              <AvatarFallback className="text-sm">
                                {getUserInitials(user.firstName, user.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                ID: {user.id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">{email}</div>
                        </td>
                        <td className="p-4">
                          {getRoleBadge(user.publicMetadata.role)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <form action={setRole} className="inline">
                              <input type="hidden" name="id" value={user.id} />
                              <input type="hidden" name="role" value="admin" />
                              <Button
                                variant="default"
                                size="sm"
                                type="submit"
                                className="cursor-pointer px-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 border-0 shadow-sm"
                                disabled={user.publicMetadata.role === 'admin'}
                              >
                                <Crown className="w-3 h-3 mr-1" />
                                Admin
                              </Button>
                            </form>
                            
                            <form action={setRole} className="inline">
                              <input type="hidden" name="id" value={user.id} />
                              <input type="hidden" name="role" value="member" />
                              <Button
                                variant="secondary"
                                size="sm"
                                type="submit"
                                className="cursor-pointer px-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0 shadow-sm"
                                disabled={user.publicMetadata.role === 'member'}
                              >
                                <User className="w-3 h-3 mr-1" />
                                Member
                              </Button>
                            </form>
                            
                            <form action={removeRole} className="inline">
                              <input type="hidden" name="id" value={user.id} />
                              <Button
                                variant="destructive"
                                size="sm"
                                type="submit"
                                className="cursor-pointer px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0 shadow-sm"
                                disabled={!user.publicMetadata.role}
                              >
                                <UserMinus className="w-3 h-3 mr-1" />
                                Remove
                              </Button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}