import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { staticPath } from '../../common/path.static';
import { CreateDeptDto, CreateUserDto, UpdateDeptDto, UpdateUserDto } from './server.dto';

@Injectable()
export class EzService {
  private apiAuth;
  private accessToken: string;
  private readonly basicHeaders: object;
  private readonly logger = new Logger(EzService.name)

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.apiAuth = {
      basicUrl: this.configService.get("EZCLOUD_BASIC_URL"),
      username: this.configService.get("EZCLOUD_USERNAME"),
      password: this.configService.get("EZCLOUD_PASSWORD"),
      clientId: this.configService.get("EZCLOUD_CLIENT_ID"),
      clientSecret: this.configService.get("EZCLOUD_CLIENT_SECRET")
    };
    this.initAccessToken();
    this.basicHeaders = { "Content-Type": "application/json" };
  }

  async initAccessToken() {
    try {
      this.accessToken = await this.fetchAccessToken();
      // 在请求头中添加 Token
      this.basicHeaders["Authorization"] = `Bearer ${this.accessToken}`
    } catch (error) {
      console.error('Error initializing access token:', error);
    }
  }

  async fetchAccessToken() {
    const [method, url] = staticPath.token
    const res = await this.httpService.axiosRef.request({
      method,
      url: this.apiAuth.basicUrl + url,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        grant_type: "password",
        username: this.apiAuth.username,
        password: this.apiAuth.password,
        client_id: this.apiAuth.clientId,
        client_secret: this.apiAuth.clientSecret,
      }
    })
    const content = res.data
    return content.access_token
  }

  async mutation(info) {
    try {
      const res = await this.httpService.axiosRef.request({
        method: info.method,
        url: this.apiAuth.basicUrl + info.url,
        headers: {...this.basicHeaders, ...(info.headers || {})},
        ...(info.options || {}),  // key: params || data
      });
      const content = res.data;
      // this.logger.log(`[MUTATION] ${info.method} ${info.url} res:`, content);
      const {code, message, data} = content || {}
      if (code === 0) {
        return data;
      } else if (code === 401) {
        this.accessToken = await this.fetchAccessToken();
        this.basicHeaders["Authorization"] = `Bearer ${this.accessToken}`;
        await this.mutation(info);
      }
    } catch (err) {
      console.log(err.content,'err');
    }
  }

  async  dept_query(thirdId){
    const [method, url] = staticPath.dept.query;
    const res = await this.mutation({method, url, options: {params: {thirdId}}});
    return res;
  }

  async dept_create(req: CreateDeptDto) {
    const [method, url] = staticPath.dept.create;
    const res = await this.mutation({method, url, options: {data: req}});
    return res;
  }

  async dept_update(req: UpdateDeptDto) {
    const [method, url] = staticPath.dept.update;
    const res =await this.mutation({method, url, options: {data: req}});
    return res;
  }

  async dept_delete(id) {
    const [method, url] = staticPath.dept.delete;
    const res = await this.mutation({method, url, options: {params: {id}}});
    return res;
  }

  async  user_query(thirdId){
    const [method, url] = staticPath.user.query;
    const res = await this.mutation({method, url, options: {params: {thirdId}}});
    return res;
  }

  async  user_create(req:CreateUserDto){
    const [method, url] = staticPath.user.create;
    const res = await this.mutation({method, url, options: {data: req}});
  }

  async  user_update(req: UpdateUserDto){
    const [method, url] = staticPath.user.update;
    const res = await this.mutation({method, url, options: {data: req}});
    return res;
  }

  async  user_delete(id){
    const [method, url] = staticPath.user.delete;
    const res = this.mutation({method, url, options: {params: {id}}});
    return res;
  }

  // 通过三方id获取系统的部门id
  async thirdIdToId(req: Array<string>){
    const deptInfos = req.map(async itemId => await this.dept_query(itemId))
    const asyncResult= await Promise.all(deptInfos);
    return asyncResult.map(item => item.id);
  }

}
