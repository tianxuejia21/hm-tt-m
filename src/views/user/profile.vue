<template>
  <div class='page-user-profile'>
    <van-nav-bar left-arrow
                 @click-left="$router.back()"
                 title="编辑资料"
                 right-text="保存"
                 @click-right="save()"></van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'user-profie',
  methods: {
    save () {
      this.$toast.sucess('保存成功')
    }
  }
}
</script>

<style scoped lang='less'></style>
