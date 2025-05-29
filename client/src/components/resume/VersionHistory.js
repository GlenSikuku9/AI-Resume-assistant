import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { format } from 'date-fns';

const VersionHistory = ({ versions, onRestore, currentVersion }) => {
  return (
    <div className="version-history">
      <h5 className="mb-3">Version History</h5>
      <ListGroup>
        {versions.map((version, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex justify-content-between align-items-center"
            active={currentVersion === index}
          >
            <div>
              <div className="fw-bold">
                Version {versions.length - index}
              </div>
              <small className="text-muted">
                {format(new Date(version.timestamp), 'MMM d, yyyy h:mm a')}
              </small>
            </div>
            {currentVersion !== index && (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onRestore(version.content, index)}
              >
                Restore
              </Button>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
      {versions.length === 0 && (
        <div className="text-center text-muted py-3">
          No versions available yet
        </div>
      )}
    </div>
  );
};

export default VersionHistory; 