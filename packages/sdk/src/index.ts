import { ClickStreamSDK } from './ClickStreamSdk';

const clickStream = new ClickStreamSDK();

export { ClickStreamSDK };

export type { ClickStreamConfig, BaseEvent, EventProperties, EventContext } from './types';

export default clickStream;
