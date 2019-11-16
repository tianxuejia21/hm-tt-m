import request from '@/utils/request'

export const login = ({
  mobile,
  code
}) => {
  return request('app/v1_0/authorizations', 'post', {
    mobile,
    code
  })
}
