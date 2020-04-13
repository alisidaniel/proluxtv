import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../core/types/models/User';
import { UploadedFile } from '../uploads/uploaded-file';
import { AppHttpClient } from '../core/http/app-http-client.service';
import {BackendResponse} from '../core/types/backend-response';

@Injectable({
    providedIn: 'root',
})
export class Users {
    constructor(private http: AppHttpClient) {}

    public get(id: number, params?: { with?: string }): BackendResponse<{user: User}> {
        return this.http.get(`users/${id}`, params);
    }

    public getAll(params: {per_page?: number, permission?: string, query?: string} = {}): Observable<User[]> {
        return this.http.get('users', params).pipe(map(response => response['pagination']['data']));
    }

    public create(payload: Object) {
        return this.http.post('users', payload);
    }

    public update(id: number, payload: Object): Observable<User> {
        return this.http.put('users/' + id, payload);
    }

    public changePassword(id: number, payload: Object): Observable<User> {
        return this.http.post('users/' + id + '/password/change', payload);
    }

    public attachRoles(id: number, payload = {}): Observable<any> {
        return this.http.post('users/' + id + '/roles/attach', payload);
    }

    public detachRoles(id: number, payload = {}): Observable<any> {
        return this.http.post('users/' + id + '/roles/detach', payload);
    }

    public addPermissions(id: number, payload = {}): Observable<{ data: User }> {
        return this.http.post('users/' + id + '/permissions/start', payload);
    }

    public removePermissions(id: number, payload = {}): Observable<{ data: User }> {
        return this.http.post('users/' + id + '/permissions/remove', payload);
    }

    public uploadAvatar(id: number, files: UploadedFile[]): Observable<User> {
        const payload = new FormData();
        payload.append('avatar', files[0].native);
        return this.http.post('users/' + id + '/avatar', payload);
    }

    public deleteAvatar(id: number): Observable<User> {
        return this.http.delete('users/' + id + '/avatar');
    }

    public delete(ids: number[]) {
        return this.http.delete(`users/${ids}`);
    }

    //

    /**
     * Sync specified user tags.
     */
    public syncTags(id: number, payload: Object): Observable<Object> {
        return this.http.post('users/' + id + '/tags/sync', payload);
    }

    /**
     * Update details about user.
     */
    public updateDetails(id: number, payload: Object): Observable<User> {
        return this.http.put('users/' + id + '/details', payload);
    }

    /**
     * Add secondary email to specified user.
     */
    public addEmail(id: number, payload: Object): BackendResponse<{user: User}> {
        return this.http.post('users/' + id + '/emails/attach', payload);
    }

    /**
     * Remove secondary email from specified user.
     */
    public removeEmail(id: number, payload: Object): Observable<User> {
        return this.http.post('users/' + id + '/emails/detach', payload);
    }
}
