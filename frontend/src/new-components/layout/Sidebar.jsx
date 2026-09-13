import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Compass,
  FileText,
  PenSquare,
  TrendingUp,
  LogOut,
  LogIn,
  BookOpen,
  Bookmark,
  ChevronsUpDown,
  ChevronRight,
  Sparkles,
  BadgeCheck,
  CreditCard,
  Bell,
  Settings2,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  useSidebar,
} from '@/new-components/ui/sidebar';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/new-components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/new-components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/new-components/ui/avatar';
import authService from '@/appwrite/auth';
import { logout } from '@/store/authSlice';

export default function AppSidebar({ ...props }) {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isMobile } = useSidebar();

  const [articlesOpen, setArticlesOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  const userInitial = userData?.name
    ? userData.name.trim().charAt(0).toUpperCase()
    : 'U';
  const userName = userData?.name || 'Creator';
  const userEmail = userData?.email || 'creator@yourblog.com';

  return (
    <Sidebar collapsible="icon" className="border-zinc-200/80 dark:border-zinc-800/80" {...props}>
      {/* ========================================================================= */}
      {/* 1. HEADER (WORKSPACE / APP SWITCHER - EXACT SHADCN SPEC)                   */}
      {/* ========================================================================= */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground active:scale-[0.98] transition-all duration-150 cursor-pointer"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs transition-transform duration-150 group-hover/menu-item:scale-105">
                    <BookOpen className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">YourBlog</span>
                    <span className="truncate text-xs text-muted-foreground">Publishing Platform</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="start"
                side={isMobile ? 'bottom' : 'right'}
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Workspace
                </DropdownMenuLabel>
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-sm border bg-blue-600 text-white">
                    <BookOpen className="size-3.5 shrink-0" />
                  </div>
                  <span className="font-medium">YourBlog Production</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ========================================================================= */}
      {/* 2. CONTENT (PLATFORM NAV & ACCORDION SUBMENUS)                            */}
      {/* ========================================================================= */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {/* Articles with Expandable Submenu (Matching Playground from shadcn) */}
            <Collapsible
              asChild
              open={articlesOpen}
              onOpenChange={setArticlesOpen}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip="Articles"
                    isActive={location.pathname.startsWith('/all-posts')}
                  >
                    <FileText className="size-4" />
                    <span>Articles</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive('/all-posts')}>
                        <Link to="/all-posts">
                          <span>All Stories</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive('/all-posts?filter=trending')}>
                        <Link to="/all-posts?filter=trending">
                          <span>Trending</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    {authStatus && (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive('/all-posts?filter=saved')}>
                          <Link to="/all-posts?filter=saved">
                            <span>Bookmarks</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            {/* Explore */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Explore" isActive={isActive('/')}>
                <Link to="/">
                  <Compass className="size-4" />
                  <span>Explore</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Write Story */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Write Story" isActive={isActive('/add-post')}>
                <Link to="/add-post">
                  <PenSquare className="size-4" />
                  <span>Write Story</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Settings with Expandable Submenu */}
            <Collapsible
              asChild
              open={settingsOpen}
              onOpenChange={setSettingsOpen}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="Settings">
                    <Settings2 className="size-4" />
                    <span>Settings</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link to={authStatus ? '/all-posts' : '/login'}>
                          <span>General</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <Link to={authStatus ? '/all-posts' : '/login'}>
                          <span>Account & Security</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* ========================================================================= */}
      {/* 3. FOOTER (USER MENU - EXACT SHADCN SPEC FROM IMAGE 2 & 3)               */}
      {/* ========================================================================= */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {authStatus ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground active:scale-[0.98] transition-all duration-150 cursor-pointer"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="" alt={userName} />
                      <AvatarFallback className="rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{userName}</span>
                      <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
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
                        <AvatarFallback className="rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{userName}</span>
                        <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate('/add-post')} className="cursor-pointer">
                      <Sparkles className="size-4" />
                      <span>Upgrade to Pro</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate('/all-posts')} className="cursor-pointer">
                      <BadgeCheck className="size-4" />
                      <span>Account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/all-posts?filter=saved')} className="cursor-pointer">
                      <CreditCard className="size-4" />
                      <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {}} className="cursor-pointer">
                      <Bell className="size-4" />
                      <span>Notifications</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/40"
                  >
                    <LogOut className="size-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenuButton
                size="lg"
                asChild
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Link to="/login">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                    <LogIn className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Sign In</span>
                    <span className="truncate text-xs text-muted-foreground">Join the community</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Interactive sidebar edge rail to toggle collapse/expand */}
      <SidebarRail />
    </Sidebar>
  );
}
