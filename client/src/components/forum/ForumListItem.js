import React from 'react';
import { Link } from 'react-router-dom';
import { getReadableTimeDifference } from '../../util/TimeHelper';

import FileIcon from '../icon/FileIcon';

function ForumListItem(props) {
  const { forum } = props;

  return (
    <div className='forum'>
      <div className='forum-title'>
        <FileIcon></FileIcon>
        <div>
          <p><Link to={`/forum/${forum.id}`}><strong>{forum.name}</strong></Link></p>
          <p className='text-muted'>{forum.name}</p>
        </div>
      </div>

      <div className='forum-threads'>
        <p>{forum.thread_count || 0}</p>
      </div>

      <div className="forum-last">
        { forum.threads[0] ? (
          <div>
          <p><Link to={`/thread/${forum.threads[0].id}`}>{forum.threads[0].subject}</Link></p>
          <p><small className="text-muted">by <Link to={`/user/${forum.threads[0].author.username}`}>{forum.threads[0].author.username}</Link></small></p>
          <p className="text-muted"><small>{getReadableTimeDifference(new Date(forum.threads[0].updated_at))}</small></p>
        </div>
        ) : (
          <p>No Threads</p>
        )}
        
      </div>

    </div>
  );
}

export default ForumListItem;