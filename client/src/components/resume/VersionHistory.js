import React from 'react';
import { ListGroup, Button, Card } from 'react-bootstrap';
import { format } from 'date-fns';
import { FaHistory, FaUndo } from 'react-icons/fa';

const VersionHistory = ({ versions, onRestore, currentVersion }) => {
  if (!versions || versions.length === 0) {
    return (
      <Card className="version-history">
        <Card.Body className="text-center text-muted">
          <FaHistory className="mb-2" size={24} />
          <p className="mb-0">No previous versions available</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="version-history">
      <Card.Header className="d-flex align-items-center">
        <FaHistory className="me-2" />
        <h6 className="mb-0">Version History</h6>
      </Card.Header>
      <ListGroup variant="flush">
        {versions.map((version, index) => {
          const versionNumber = versions.length - index;
          const isCurrentVersion = currentVersion === index;
          
          return (
            <ListGroup.Item
              key={index}
              className={`d-flex justify-content-between align-items-center ${isCurrentVersion ? 'active' : ''}`}
            >
              <div>
                <div className="fw-bold">
                  Version {versionNumber}
                  {isCurrentVersion && <span className="ms-2">(Current)</span>}
                </div>
                <small className="text-muted">
                  {format(new Date(version.timestamp), 'MMM d, yyyy h:mm a')}
                </small>
              </div>
              {!isCurrentVersion && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => onRestore(version.content, index)}
                  title="Restore this version"
                >
                  <FaUndo className="me-1" />
                  Restore
                </Button>
              )}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );
};

export default VersionHistory; 