export default function DesktopSidebar() {
  return (
    <div class="h-screen w-64 overflow-y-scroll flex flex-col justify-between gap-6 p-2 bg-layout-primary">
      <div class="flex flex-col gap-8 grow">
        <header class="flex justify-between items-center">
          <A class="block w-26" href="/">
            <Logo />
          </A>
          <Search />
        </header>
        <NewNote />
        <Recents />
        <Folders />
      </div>
      <div class="flex flex-col gap-6">
        <More />
        <Profile />
      </div>
    </div>
  )
}
