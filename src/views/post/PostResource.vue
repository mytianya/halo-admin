<template>
  <div>
    <a-form layout="inline" :form="form" @submit="handleSubmit">
      <a-form-item>
        <a-input placeholder="资源描述" />
      </a-form-item>
      <a-form-item>
        <a-input placeholder="资源链接地址" />
      </a-form-item>
      <a-form-item>
        <a-input placeholder="提取码" />
      </a-form-item>
      <a-form-item>
        <a-switch checked-children="可见" un-checked-children="不可见" default-checked />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" icon="plus" @click="addResourceItem"></a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="danger" icon="minus" @click="plusResourceItem"></a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    addResourceItem() {},
    plusResourceItem() {}
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  }
}
</script>
