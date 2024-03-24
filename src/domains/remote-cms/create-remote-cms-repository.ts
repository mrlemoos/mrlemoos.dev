import 'server-only';

import ContentfulRemoteCMSRepository from './_/contentful-remote-cms-repository';
import type RemoteCMSRepository from './remote-cms-repository';

/**
 * The `createRemoteCMSRepository()` function creates a new instance of a remote
 * Content Management System (CMS) repository.
 *
 * This function must only be used on the server side.
 */
export default function createRemoteCMSRepository(): RemoteCMSRepository {
	return new ContentfulRemoteCMSRepository();
}
