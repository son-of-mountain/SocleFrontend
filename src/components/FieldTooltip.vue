<script setup>
defineProps({
  text: String
})
</script>

<template>
  <span class="tooltip-wrapper" :title="text">
    <i class="bi bi-question-circle-fill tooltip-icon"></i>
  </span>
</template>

<style scoped>
.tooltip-wrapper {
  display: inline-flex;
  margin-left: 0.4rem;
  cursor: help;
}

.tooltip-icon {
  color: #FFD700;
  font-size: 16px;
  transition: transform 0.2s;
}

.tooltip-icon:hover {
  transform: scale(1.2);
  color: #FFA500;
}
</style>
