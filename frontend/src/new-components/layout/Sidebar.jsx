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
import { Avatar, AvatarFallback } from '@/new-components/ui/avatar';
import authService from '@/appwrite/auth';
import { logout } from '@/store/authSlice';
import { cn } from '@/lib/utils';

export default function AppSidebar({ ...props }) {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isMobile, state, toggleSidebar } = useSidebar();
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const isCollapsed = state === 'collapsed';

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate('/');
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
  const userEmail = userData?.email || 'creator@yourblog.com';

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
                className="group/brand flex w-full items-center gap-2"
              >
                {/* Logo Box with Hover Toggle Swap (Zero Blue Corner Bleed) */}
                <div
                  className={cn(
                    'relative flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg shadow-xs transition-colors',
                    isCollapsed && isLogoHovered
                      ? 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
                      : 'bg-blue-600 text-white group-data-[collapsible=icon]:group-hover/brand:bg-zinc-200 group-data-[collapsible=icon]:group-hover/brand:text-zinc-700 dark:group-data-[collapsible=icon]:group-hover/brand:bg-zinc-800 dark:group-data-[collapsible=icon]:group-hover/brand:text-zinc-200'
                  )}
                >
                  {/* Default: BookOpen logo (Image 1) */}
                  <BookOpen
                    className={cn(
                      'size-4 transition-all duration-150',
                      isCollapsed && isLogoHovered ? 'hidden' : 'block',
                      'group-data-[collapsible=icon]:group-hover/brand:hidden'
                    )}
                  />

                  {/* On Hover when Collapsed: PanelLeft sidebar toggle icon (Image 2) */}
                  <PanelLeft
                    className={cn(
                      'size-4 transition-all duration-150',
                      isCollapsed && isLogoHovered ? 'block' : 'hidden',
                      'group-data-[collapsible=icon]:group-hover/brand:block'
                    )}
                  />
                </div>

                {/* Brand Text - hidden automatically when collapsed */}
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
                    YourBlog
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    Publishing Platform
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
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side={isMobile ? 'bottom' : 'right'}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
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
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => navigate('/add-post')}
                      className="cursor-pointer gap-2"
                    >
                      <PenSquare className="size-4" />
                      <span>Write Story</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate('/all-posts')}
                      className="cursor-pointer gap-2"
                    >
                      <FileText className="size-4" />
                      <span>All Articles</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer gap-2 text-red-600 focus:bg-red-50 dark:text-red-400 dark:focus:bg-red-950/40"
                  >
                    <LogOut className="size-4" />
                    <span>Log out</span>
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
    </Sidebar>
  );
}
