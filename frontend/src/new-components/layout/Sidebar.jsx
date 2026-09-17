import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Compass,
  FileText,
  PenSquare,
  LogOut,
  LogIn,
  UserPlus,
  BookOpen,
  ChevronsUpDown,
  PanelLeft,
  User,
  Settings,
  HelpCircle,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from '@/new-components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/new-components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/new-components/ui/avatar';
import { Badge } from '@/new-components/ui/badge';
import authService from '@/appwrite/auth';
import { logout } from '@/store/authSlice';
import { cn } from '@/lib/utils';
import { MarginIcon } from '../ui/MarginIcon';
import { HelpSupportDialog } from './HelpSupportDialog';

export default function AppSidebar({ ...props }) {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isMobile, state, toggleSidebar } = useSidebar();
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const isCollapsed = state === 'collapsed';

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => {
    if (!path) return false;
    const [pathPart, queryPart] = path.split('?');
    if (queryPart) {
      return location.pathname === pathPart && location.search === `?${queryPart}`;
    }
    return location.pathname === pathPart && !location.search;
  };

  const userInitial = userData?.name ? userData.name.trim().charAt(0).toUpperCase() : 'U';
  const userName = userData?.name || 'Creator';
  const userEmail = userData?.email || 'creator@margin.com';
  const userAvatarUrl =
    userData?.prefs?.avatarUrl ||
    userData?.avatarUrl ||
    (userData?.$id ? localStorage.getItem(`margin_avatar_${userData.$id}`) : null);

  return (
    <Sidebar
      collapsible="icon"
      className="border-zinc-200/80 dark:border-zinc-800/80"
      {...props}
    >
      {/* ========================================================================= */}
      {/* 1. HEADER (BRANDING / LOGO LINK)                                          */}
      {/* ========================================================================= */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={isCollapsed ? 'Expand Sidebar' : undefined}
              asChild
              className="cursor-pointer"
            >
              <Link
                to="/"
                onClick={(e) => {
                  if (isCollapsed) {
                    e.preventDefault();
                    toggleSidebar();
                  }
                }}
                onMouseEnter={() => setIsLogoHovered(true)}
                onMouseLeave={() => setIsLogoHovered(false)}
                className="group/brand flex w-full items-center gap-2.5"
              >
                {/* Logo Box with Hover Toggle Swap */}
                <div className="relative flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                  {/* Default: Margin logo icon */}
                  <MarginIcon
                    className={cn(
                      'size-8 transition-all duration-150',
                      isCollapsed && isLogoHovered ? 'hidden' : 'block',
                      'group-data-[collapsible=icon]:group-hover/brand:hidden'
                    )}
                  />

                  {/* On Hover when Collapsed: PanelLeft sidebar toggle icon */}
                  <div
                    className={cn(
                      'size-8 items-center justify-center bg-zinc-200 text-zinc-700 transition-all duration-150 dark:bg-zinc-800 dark:text-zinc-200',
                      isCollapsed && isLogoHovered ? 'flex' : 'hidden',
                      'group-data-[collapsible=icon]:group-hover/brand:flex'
                    )}
                  >
                    <PanelLeft className="size-4" />
                  </div>
                </div>

                {/* Brand Text - hidden automatically when collapsed */}
                <div className="flex flex-1 items-center text-left group-data-[collapsible=icon]:hidden">
                  <span className="pr-1 font-['Inter',sans-serif] text-xl font-normal text-zinc-900 italic select-none dark:text-zinc-100">
                    Margin
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ========================================================================= */}
      {/* 2. CONTENT (ACTUAL CODED APPLICATION ROUTES)                              */}
      {/* ========================================================================= */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {/* Explore / Home */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Explore" isActive={isActive('/')}>
                <Link to="/">
                  <Compass className="size-4" />
                  <span>Explore</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* All Articles */}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="All Articles"
                isActive={isActive('/all-posts')}
              >
                <Link to="/all-posts">
                  <FileText className="size-4" />
                  <span>All Articles</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Write Story (Navigates to /add-post, protected route) */}
            {/* Write Story (Navigates to /add-post, protected route) */}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Write Story"
                isActive={isActive('/add-post')}
              >
                <Link to="/add-post">
                  <PenSquare className="size-4" />
                  <span>Write Story</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Account Group (Separate Pages for Profile & Settings) */}
        {authStatus && (
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Profile"
                  isActive={isActive('/profile')}
                >
                  <Link to="/profile">
                    <User className="size-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Settings"
                  isActive={isActive('/settings')}
                >
                  <Link to="/settings">
                    <Settings className="size-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* ========================================================================= */}
      {/* 3. FOOTER (AUTH & PROFILE CONTROLS)                                       */}
      {/* ========================================================================= */}
      <SidebarFooter>
        <SidebarMenu>
          {authStatus ? (
            <SidebarMenuItem>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      {userAvatarUrl && (
                        <AvatarImage
                          src={userAvatarUrl}
                          alt={userName}
                          className="rounded-lg object-cover"
                        />
                      )}
                      <AvatarFallback className="rounded-lg bg-zinc-900 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{userName}</span>
                      <span className="text-muted-foreground truncate text-xs">
                        {userEmail}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-52 rounded-2xl border border-zinc-200/80 bg-white p-1.5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
                  side={isMobile ? 'bottom' : 'right'}
                  align="end"
                  sideOffset={8}
                >
                  <DropdownMenuItem
                    onClick={() => setIsHelpDialogOpen(true)}
                    className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  >
                    <HelpCircle className="size-4 text-zinc-500" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ) : (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Log In" isActive={isActive('/login')}>
                  <Link to="/login">
                    <LogIn className="size-4" />
                    <span>Log In</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Sign Up"
                  isActive={isActive('/signup')}
                >
                  <Link to="/signup">
                    <UserPlus className="size-4" />
                    <span>Sign Up</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarFooter>

      {/* Interactive sidebar edge rail to toggle collapse/expand */}
      <SidebarRail />

      {/* Help & Support Dialog */}
      <HelpSupportDialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen} />
    </Sidebar>
  );
}
