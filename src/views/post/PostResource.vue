<template>
  <div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      resources: [],
    }
  },
  methods: {
    minusResourceItem(index) {
      this.resources.splice(index, 1)
    },
    plusResourceItem() {
      this.resources.push({})
    },
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
}
</script>
