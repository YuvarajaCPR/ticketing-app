/*************************************************
 * GOBOX
 * @exports
 * ProfileService.ts
 * Created by Abdul on 26/09/2022
 * Copyright © 2022 GOBOX. All rights reserved.
 *************************************************/

import {api} from '../api';
import {CONTACT_SUPPORT} from '../../Utils/URL';

export const profileApi = api.injectEndpoints({
  endpoints: build => ({
       //To send support message
       sendSupportMessage: build.mutation({
        query: (params) => ({
          url: `${CONTACT_SUPPORT}`,
          method: "POST",
          body: params,
        }),
      }),
  }),
  overrideExisting: true,
});

export const {useSendSupportMessageMutation} = profileApi;
