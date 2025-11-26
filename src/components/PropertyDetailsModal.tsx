import React, { useState } from 'react';
import { getFileFromPath } from '../api/homeownerApi';
import { getLandFileFromPath } from '../api/landownerApi';

interface PropertyDetailsModalProps {
  property: any;
  type: 'home' | 'land';
  onClose: () => void;
}

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({ property, type, onClose }) => {
  const [showAllDocs, setShowAllDocs] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullSizeImage, setFullSizeImage] = useState<string | null>(null);

  const getImageUrl = (doc: any) => {
    return type === 'home' ? getFileFromPath(doc.DocumentPath) : getLandFileFromPath(doc.DocumentPath);
  };

  const images = (property.Documents || []).filter((doc: any) => doc.DocumentType === 1);
  const allFiles = property.Documents || [];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#f8f6f0', borderRadius: '15px', maxWidth: '800px',
        width: '100%', maxHeight: '90vh', overflow: 'auto',
        position: 'relative', border: '1px solid #e8e4dc'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '15px', right: '15px',
            background: '#e57373', color: 'white', border: 'none',
            borderRadius: '50%', width: '30px', height: '30px',
            cursor: 'pointer', fontSize: '16px', zIndex: 1001
          }}
        >
          ×
        </button>

        {images.length > 0 && (
          <div style={{ height: '400px', position: 'relative', overflow: 'hidden' }}>
            <img
              src={getImageUrl(images[currentImageIndex])}
              alt="Property"
              style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => setFullSizeImage(getImageUrl(images[currentImageIndex]))}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1)}
                  style={{
                    position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none',
                    borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer'
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={() => setCurrentImageIndex(currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0)}
                  style={{
                    position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none',
                    borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer'
                  }}
                >
                  ›
                </button>
                <div style={{
                  position: 'absolute', bottom: '15px', right: '15px',
                  background: 'rgba(0,0,0,0.7)', color: 'white',
                  padding: '5px 10px', borderRadius: '15px', fontSize: '12px'
                }}>
                  {currentImageIndex + 1}/{images.length}
                </div>
              </>
            )}
          </div>
        )}

        <div style={{ padding: '20px' }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
            {type === 'home' ? (property.HomeName || `Home ${property.HomeId}`) : (property.LandName || `Land ${property.LandId}`)}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            {type === 'home' ? (
              <>
                <div><strong>Owner:</strong> {property.OwnerName || 'N/A'}</div>
                <div><strong>City:</strong> {property.HomeCity || 'N/A'}</div>
                <div><strong>Price:</strong> ₹{property.HomePriceInital || 'N/A'}</div>
                <div><strong>State:</strong> {property.HomeState || 'N/A'}</div>
                <div><strong>Pincode:</strong> {property.HomePincode || 'N/A'}</div>
                <div><strong>Area:</strong> {property.AreaInSqFt || 'N/A'} sq ft</div>
                <div style={{ gridColumn: '1 / -1' }}><strong>Address:</strong> {property.HomeAddress || 'N/A'}</div>
                <div style={{ gridColumn: '1 / -1' }}><strong>Description:</strong> {property.HomeDescription || 'N/A'}</div>
              </>
            ) : (
              <>
                <div><strong>Owner:</strong> {property.OwnerName || 'N/A'}</div>
                <div><strong>Location:</strong> {property.LandLocation || 'N/A'}</div>
                <div><strong>Price:</strong> ₹{property.LandPrice || 'N/A'}</div>
                <div><strong>Area:</strong> {property.LandArea || 'N/A'} sq ft</div>
                <div style={{ gridColumn: '1 / -1' }}><strong>Address:</strong> {property.LandAddress || 'N/A'}</div>
                <div style={{ gridColumn: '1 / -1' }}><strong>Description:</strong> {property.LandDescription || 'N/A'}</div>
              </>
            )}
            {property.OwnerEmail && <div><strong>Owner Email:</strong> {property.OwnerEmail}</div>}
            {property.OwnerPhoneNo && <div><strong>Owner Phone:</strong> {property.OwnerPhoneNo}</div>}
          </div>

          <button
            onClick={() => setShowAllDocs(!showAllDocs)}
            style={{
              width: '100%', padding: '12px', background: '#b78a62', color: 'white',
              border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '15px'
            }}
          >
            {showAllDocs ? 'Hide' : 'Show'} All Documents ({allFiles.length})
          </button>

          {showAllDocs && allFiles.length > 0 && (
            <div style={{ background: '#f0ede5', padding: '15px', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 15px 0' }}>All Uploaded Files:</h4>
              {allFiles.map((doc: any, index: number) => (
                <div key={index} style={{
                  background: '#f8f6f0', padding: '10px', marginBottom: '10px',
                  borderRadius: '5px', border: '1px solid #e8e4dc'
                }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>File Type:</strong> {doc.DocumentType === 1 ? 'Image' : 'Document'}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>File Path:</strong> {doc.DocumentPath || 'N/A'}
                  </div>
                  {doc.DocumentType === 1 ? (
                    <div>
                      <img
                        src={getImageUrl(doc)}
                        alt="Document"
                        style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', borderRadius: '5px', cursor: 'pointer' }}
                        onClick={() => setFullSizeImage(getImageUrl(doc))}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling!.textContent = 'Image not available';
                        }}
                      />
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Click to view full size</div>
                    </div>
                  ) : (
                    <div>
                      {doc.DocumentDetailsExtracted ? (
                        <pre style={{
                          background: '#f5f5f5', padding: '10px', borderRadius: '5px',
                          whiteSpace: 'pre-wrap', fontSize: '12px', maxHeight: '150px',
                          overflow: 'auto', border: '1px solid #ddd'
                        }}>
                          {doc.DocumentDetailsExtracted}
                        </pre>
                      ) : (
                        <div style={{ color: '#666', fontStyle: 'italic' }}>
                          No extracted text available
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {fullSizeImage && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.9)', zIndex: 1002,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setFullSizeImage(null)}>
          <img
            src={fullSizeImage}
            alt="Full size"
            style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setFullSizeImage(null)}
            style={{
              position: 'absolute', top: '20px', right: '20px',
              background: '#e57373', color: 'white', border: 'none',
              borderRadius: '50%', width: '40px', height: '40px',
              cursor: 'pointer', fontSize: '20px'
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsModal;