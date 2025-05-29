import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UserPlus, Mail, User, Shield } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { UserInvite, UserRole } from '@/types/user';

const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as UserRole,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'John Manager',
    email: 'manager@example.com',
    role: 'test_manager' as UserRole,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
  },
  {
    id: '3',
    name: 'Jane Engineer',
    email: 'engineer@example.com',
    role: 'test_engineer' as UserRole,
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-02-01'),
  },
];

const mockInvites: UserInvite[] = [
  {
    id: '101',
    email: 'pending@example.com',
    role: 'test_engineer',
    status: 'pending',
    createdAt: new Date('2023-03-10'),
  }
];

const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'test_manager', 'test_engineer'], {
    required_error: 'Please select a role',
  }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const UserManagement = () => {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState(mockUsers);
  const [invites, setInvites] = useState(mockInvites);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: '',
      role: 'test_engineer',
    },
  });
  
  if (!hasPermission('admin')) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the user management page.
          </p>
        </div>
      </MainLayout>
    );
  }

  const handleInviteUser = (data: UserFormValues) => {
    console.log('Inviting user:', data);
    
    const newInvite: UserInvite = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      role: data.role,
      status: 'pending',
      createdAt: new Date(),
    };
    
    setInvites([...invites, newInvite]);
    
    toast({
      title: 'Invitation Sent',
      description: `An invitation has been sent to ${data.email}.`,
    });
    
    setInviteDialogOpen(false);
    form.reset({
      email: '',
      role: 'test_engineer',
    });
  };
  
  const getRoleBadgeColor = (role: UserRole) => {
    switch(role) {
      case 'admin':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'test_manager':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'test_engineer':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
  
  const getRoleIcon = (role: UserRole) => {
    switch(role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'test_manager':
        return <User className="h-4 w-4" />;
      case 'test_engineer':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite New User</DialogTitle>
                <DialogDescription>
                  Send an invitation email to add a new user to the system.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleInviteUser)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="user@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Role</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="test_manager">Test Manager</SelectItem>
                            <SelectItem value="test_engineer">Test Engineer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1.5">{user.role.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/user-management/edit/${user.id}`)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            {invites.length === 0 ? (
              <p className="text-muted-foreground">No pending invitations.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Invited Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell>{invite.email}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(invite.role)}`}>
                          {getRoleIcon(invite.role)}
                          <span className="ml-1.5">{invite.role.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>{invite.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          Pending
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Resend
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UserManagement;
