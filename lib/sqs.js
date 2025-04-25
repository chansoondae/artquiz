import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

// AWS SQS 클라이언트 초기화
const sqsClient = new SQSClient({
  region: process.env.AWS_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// SQS Queue URL을 환경 변수에서 가져옴
const QUEUE_URL = process.env.AWS_SQS_QUEUE_URL;

/**
 * SQS 큐에 메시지 전송
 * @param {Object} messageData 전송할 메시지 데이터
 * @returns {Promise<string>} 메시지 ID
 */
export async function sendToQueue(messageData) {
  if (!QUEUE_URL) {
    throw new Error('SQS Queue URL이 설정되지 않았습니다.');
  }

  try {
    const params = {
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(messageData),
      MessageAttributes: {
        MessageType: {
          DataType: 'String',
          StringValue: messageData.type || 'DEFAULT'
        }
      }
    };

    const command = new SendMessageCommand(params);
    const response = await sqsClient.send(command);
    
    console.log('SQS 메시지 전송 성공:', response.MessageId);
    return response.MessageId;
  } catch (error) {
    console.error('SQS 메시지 전송 실패:', error);
    throw error;
  }
}