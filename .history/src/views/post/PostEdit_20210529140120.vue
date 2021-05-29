<template>
  <page-view affix :title="postToStage.title ? postToStage.title : '新文章'">
    <template slot="extra">
      <a-space>
        <ReactiveButton
          type="danger"
          @click="handleSaveDraft(false)"
          @callback="draftSavederrored = false"
          :loading="draftSaving"
          :errored="draftSavederrored"
          text="保存草稿"
          loadedText="保存成功"
          erroredText="保存失败"
        ></ReactiveButton>
        <a-button @click="handlePreview" :loading="previewSaving">预览</a-button>
        <a-button type="primary" @click="postSettingVisible = true">发布</a-button>
        <a-button type="dashed" @click="attachmentDrawerVisible = true">附件库</a-button>
      </a-space>
    </template>
    <a-row :gutter="12">
      <a-col :span="24">
        <div class="mb-4">
          <a-input v-model="postToStage.title" size="large" placeholder="请输入文章标题" />
        </div>

        <div id="editor">
          <MarkdownEditor
            :originalContent="postToStage.originalContent"
            @onSaveDraft="handleSaveDraft(true)"
            @onContentChange="onContentChange"
          />

          <!-- <RichTextEditor
            v-else
            :originalContent="postToStage.originalContent"
            @onContentChange="onContentChange"
          />-->
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="12">
      <a-col :span="24">
        <a-button type="dashed" @click="plusResourceItem()"> <a-icon type="plus" /> 添加资源 </a-button>
        <a-form layout="inline" v-for="(res, index) in postToStage.resources" :key="index">
          <a-form-item label="资源描述" size="large">
            <a-input placeholder="资源描述" v-model="res.name" />
          </a-form-item>
          <a-form-item label="地址" size="large">
            <a-input placeholder="资源链接地址" v-model="res.url" style="width:250px" />
          </a-form-item>
          <a-form-item label="类型">
            <a-select v-model="res.type" placeholder="请选择下载协议" style="width: 150px">
              <a-select-option v-for="type in types" :value="type.value" :title="type.name" :key="type.value">
                {{ type.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="提取码">
            <a-input placeholder="提取码" v-model="res.shareCode" style="max-width:80px" />
          </a-form-item>
          <a-form-item>
            <a-switch checked-children="可见" un-checked-children="关闭" default-checked v-model="res.status" />
          </a-form-item>
          <a-form-item>
            <a-button type="danger" icon="minus" @click="minusResourceItem(index)" size="small"></a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>

    <PostSettingDrawer
      :post="postToStage"
      :tagIds="selectedTagIds"
      :categoryIds="selectedCategoryIds"
      :metas="selectedMetas"
      :visible="postSettingVisible"
      @close="postSettingVisible = false"
      @onRefreshPost="onRefreshPostFromSetting"
      @onRefreshTagIds="onRefreshTagIdsFromSetting"
      @onRefreshCategoryIds="onRefreshCategoryIdsFromSetting"
      @onRefreshPostMetas="onRefreshPostMetasFromSetting"
      @onSaved="handleRestoreSavedStatus"
    />

    <AttachmentDrawer v-model="attachmentDrawerVisible" />

    <footer-tool-bar
      :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%' }"
    >
      <a-space>
        <ReactiveButton
          type="danger"
          @click="handleSaveDraft(false)"
          @callback="draftSavederrored = false"
          :loading="draftSaving"
          :errored="draftSavederrored"
          text="保存草稿"
          loadedText="保存成功"
          erroredText="保存失败"
        ></ReactiveButton>
        <a-button @click="handlePreview" :loading="previewSaving">预览</a-button>
        <a-button type="primary" @click="postSettingVisible = true">发布</a-button>
        <a-button type="dashed" @click="attachmentDrawerVisible = true">附件库</a-button>
      </a-space>
    </footer-tool-bar>
  </page-view>
</template>

<script>
import { mixin, mixinDevice } from '@/mixins/mixin.js'
import { datetimeFormat } from '@/utils/datetime'

import PostSettingDrawer from './components/PostSettingDrawer'
import AttachmentDrawer from '../attachment/components/AttachmentDrawer'
import MarkdownEditor from '@/components/Editor/MarkdownEditor'
//import PostResource from '@/views/post/PostResource'
// import RichTextEditor from '@/components/editor/RichTextEditor'
import { PageView } from '@/layouts'
import postApi from '@/api/post'
export default {
  mixins: [mixin, mixinDevice],
  components: {
    PostSettingDrawer,
    AttachmentDrawer,
    MarkdownEditor,
    PostResource,
    // RichTextEditor
    PageView
  },
  data() {
    return {
      attachmentDrawerVisible: false,
      postSettingVisible: false,
      postToStage: {
        resources: []
      },
      selectedTagIds: [],
      selectedCategoryIds: [],
      selectedMetas: [],
      contentChanges: 0,
      draftSaving: false,
      previewSaving: false,
      draftSavederrored: false,
      types: [
        { name: '网盘', value: 'wangpan' },
        { name: 'bt', value: 'bt' },
        { name: '直链下载', value: 'direct' }
      ]
    }
  },
  beforeRouteEnter(to, from, next) {
    // Get post id from query
    const postId = to.query.postId
    next(vm => {
      if (postId) {
        postApi.get(postId).then(response => {
          const post = response.data.data
          vm.postToStage = post
          vm.selectedTagIds = post.tagIds
          vm.selectedCategoryIds = post.categoryIds
          vm.selectedMetas = post.metas
        })
      }
    })
  },
  destroyed: function() {
    if (this.postSettingVisible) {
      this.postSettingVisible = false
    }
    if (this.attachmentDrawerVisible) {
      this.attachmentDrawerVisible = false
    }
    if (window.onbeforeunload) {
      window.onbeforeunload = null
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.postSettingVisible) {
      this.postSettingVisible = false
    }
    if (this.attachmentDrawerVisible) {
      this.attachmentDrawerVisible = false
    }

    if (this.contentChanges <= 1) {
      next()
    } else {
      this.$confirm({
        title: '当前页面数据未保存，确定要离开吗？',
        content: () => <div style="color:red;">如果离开当面页面，你的数据很可能会丢失！</div>,
        onOk() {
          next()
        },
        onCancel() {
          next(false)
        }
      })
    }
  },
  mounted() {
    window.onbeforeunload = function(e) {
      e = e || window.event
      if (e) {
        e.returnValue = '当前页面数据未保存，确定要离开吗？'
      }
      return '当前页面数据未保存，确定要离开吗？'
    }
  },
  methods: {
    minusResourceItem(index) {
      this.postToStage.resources.splice(index, 1)
    },
    plusResourceItem() {
      this.postToStage.resources.push({})
    },
    handleSaveDraft(draftOnly = false) {
      this.$log.debug('Draft only: ' + draftOnly)
      this.postToStage.status = 'DRAFT'
      if (!this.postToStage.title) {
        this.postToStage.title = datetimeFormat(new Date(), 'YYYY-MM-DD-HH-mm-ss')
      }
      this.draftSaving = true
      if (this.postToStage.id) {
        // Update the post
        if (draftOnly) {
          postApi
            .updateDraft(this.postToStage.id, this.postToStage.originalContent)
            .then(() => {
              this.handleRestoreSavedStatus()
            })
            .catch(() => {
              this.draftSavederrored = true
            })
            .finally(() => {
              setTimeout(() => {
                this.draftSaving = false
              }, 400)
            })
        } else {
          postApi
            .update(this.postToStage.id, this.postToStage, false)
            .then(response => {
              this.postToStage = response.data.data
              this.handleRestoreSavedStatus()
            })
            .catch(() => {
              this.draftSavederrored = true
            })
            .finally(() => {
              setTimeout(() => {
                this.draftSaving = false
              }, 400)
            })
        }
      } else {
        // Create the post
        postApi
          .create(this.postToStage, false)
          .then(response => {
            this.postToStage = response.data.data
            this.handleRestoreSavedStatus()
          })
          .catch(() => {
            this.draftSavederrored = true
          })
          .finally(() => {
            setTimeout(() => {
              this.draftSaving = false
            }, 400)
          })
      }
    },
    handlePreview() {
      this.postToStage.status = 'DRAFT'
      if (!this.postToStage.title) {
        this.postToStage.title = datetimeFormat(new Date(), 'YYYY-MM-DD-HH-mm-ss')
      }
      this.previewSaving = true
      if (this.postToStage.id) {
        // Update the post
        postApi.update(this.postToStage.id, this.postToStage, false).then(response => {
          this.$log.debug('Updated post', response.data.data)
          postApi
            .preview(this.postToStage.id)
            .then(response => {
              window.open(response.data, '_blank')
              this.handleRestoreSavedStatus()
            })
            .finally(() => {
              setTimeout(() => {
                this.previewSaving = false
              }, 400)
            })
        })
      } else {
        // Create the post
        postApi.create(this.postToStage, false).then(response => {
          this.$log.debug('Created post', response.data.data)
          this.postToStage = response.data.data
          postApi
            .preview(this.postToStage.id)
            .then(response => {
              window.open(response.data, '_blank')
              this.handleRestoreSavedStatus()
            })
            .finally(() => {
              setTimeout(() => {
                this.previewSaving = false
              }, 400)
            })
        })
      }
    },
    handleRestoreSavedStatus() {
      this.contentChanges = 0
    },
    onContentChange(val) {
      this.contentChanges++
      this.postToStage.originalContent = val
    },
    onRefreshPostFromSetting(post) {
      this.postToStage = post
    },
    onRefreshTagIdsFromSetting(tagIds) {
      this.selectedTagIds = tagIds
    },
    onRefreshCategoryIdsFromSetting(categoryIds) {
      this.selectedCategoryIds = categoryIds
    },
    onRefreshPostMetasFromSetting(metas) {
      this.selectedMetas = metas
    }
  }
}
</script>
