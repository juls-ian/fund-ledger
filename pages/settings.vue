<template>
  <div class="grid grid-cols-6 gap-8">
    <!-- Nuxt UI Component -->
    <UVerticalNavigation :links="links" class="col-span-2" />
    <div class="col-span-4">
      <!-- the children pages -->
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
  const links = [
    {
      label: "Profile",
      //   folder/file
      to: "/settings/profile",
    },
    {
      label: "Avatar",
      to: "/settings/avatar",
    },
    {
      label: "Options",
      to: "/settings/options",
    },
  ];
</script>