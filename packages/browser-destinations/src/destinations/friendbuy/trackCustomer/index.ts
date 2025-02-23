import type { BrowserActionDefinition } from '../../../lib/browser-destinations'

import type { FriendbuyAPI } from '../types'
import type { Settings } from '../generated-types'
import type { Payload } from './generated-types'
import type { AnalyticsPayload, ConvertFun, EventMap } from '@segment/actions-shared'

import { COPY, ROOT, mapEvent } from '@segment/actions-shared'
import { trackCustomerFields } from '@segment/actions-shared'
import { addName, parseDate } from '@segment/actions-shared'

// see https://segment.com/docs/config-api/fql/
export const trackCustomerDefaultSubscription = 'type = "identify"'

const trackCustomerPub: EventMap = {
  fields: {
    customerId: { name: 'id' },
    anonymousID: COPY,
    email: COPY,
    isNewCustomer: COPY,
    loyaltyStatus: COPY,
    firstName: COPY,
    lastName: COPY,
    name: COPY,
    age: COPY,
    // fbt-merchant-api complains about birthday being an object but passes it anyway.
    birthday: { convert: parseDate as ConvertFun },
    language: COPY,
    addressCountry: { name: 'country' },
    addressState: { name: 'state' },
    addressCity: { name: 'city' },
    addressPostalCode: { name: 'zipCode' }
  },
  unmappedFieldObject: ROOT
}

const action: BrowserActionDefinition<Settings, FriendbuyAPI, Payload> = {
  title: 'Track Customer',
  description: 'Create a new customer profile or update an existing customer profile.',
  defaultSubscription: trackCustomerDefaultSubscription,
  platform: 'web',
  fields: trackCustomerFields,

  perform: (friendbuyAPI, { payload }) => {
    addName(payload)
    const friendbuyPayload = mapEvent(trackCustomerPub, payload as unknown as AnalyticsPayload)
    friendbuyAPI.push(['track', 'customer', friendbuyPayload, true])
  }
}

export default action
