import httpx
import base64
import json
from typing import List, Dict, Any, Optional
from ..core.config import settings
from ..models.schemas import ActionDescription, PoseFrame
import logging

logger = logging.getLogger(__name__)


class GLMService:
    """智谱GLM-4.5V API服务"""
    
    def __init__(self):
        self.api_key = settings.GLM_API_KEY
        self.base_url = settings.GLM_BASE_URL
        self.model = settings.GLM_MODEL
        
        if not self.api_key:
            logger.warning("GLM API key not configured")
    
    async def _make_request(self, messages: List[Dict[str, Any]]) -> Optional[str]:
        """发送请求到GLM API"""
        if not self.api_key:
            logger.error("GLM API key not configured")
            return None
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 2000
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}chat/completions",
                    headers=headers,
                    json=payload
                )
                response.raise_for_status()
                
                result = response.json()
                return result["choices"][0]["message"]["content"]
                
        except Exception as e:
            logger.error(f"GLM API request failed: {e}")
            return None
    
    def _encode_image_frame(self, frame_data: bytes) -> str:
        """将图像帧编码为base64"""
        return base64.b64encode(frame_data).decode('utf-8')
    
    async def analyze_dance_action(
        self, 
        frame_data: bytes, 
        pose_data: PoseFrame,
        context: str = ""
    ) -> Optional[str]:
        """分析舞蹈动作"""
        
        image_base64 = self._encode_image_frame(frame_data)
        
        # 构建姿态信息描述
        pose_description = self._format_pose_data(pose_data)
        
        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"""请分析这个舞蹈动作帧。

上下文信息：{context}

姿态关键点数据：
{pose_description}

请提供以下分析：
1. 动作名称或类型
2. 动作的详细描述
3. 技术要点和注意事项
4. 常见错误和纠正方法
5. 难度等级(1-5级)

请用中文回答，格式要清晰易懂。"""
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_base64}"
                        }
                    }
                ]
            }
        ]
        
        return await self._make_request(messages)
    
    async def generate_teaching_guide(
        self,
        actions: List[ActionDescription],
        beats_info: Dict[str, Any],
        segments_info: List[Dict[str, Any]]
    ) -> Optional[str]:
        """生成整体教学指导"""
        
        # 构建动作序列描述
        actions_text = "\n".join([
            f"时间 {action.start_time:.1f}s-{action.end_time:.1f}s: {action.action_name} - {action.description}"
            for action in actions
        ])
        
        # 构建节拍信息
        beats_text = f"平均BPM: {beats_info.get('average_bpm', 'N/A')}"
        
        # 构建段落信息
        segments_text = "\n".join([
            f"{seg['start_time']:.1f}s-{seg['end_time']:.1f}s: {seg['segment_type']} - {seg.get('description', '')}"
            for seg in segments_info
        ])
        
        messages = [
            {
                "role": "user",
                "content": f"""请为这个舞蹈视频生成一份完整的教学指导。

音乐信息：
{beats_text}

视频段落：
{segments_text}

动作序列：
{actions_text}

请生成包含以下内容的教学指导：
1. 舞蹈整体介绍和风格特点
2. 学习前的准备工作
3. 分段教学计划
4. 每个动作的详细教学步骤
5. 练习建议和进阶方法
6. 常见问题解答

请用中文编写，语言要通俗易懂，适合初学者理解。"""
            }
        ]
        
        return await self._make_request(messages)
    
    async def analyze_video_segment(
        self,
        audio_features: Dict[str, Any],
        segment_start: float,
        segment_end: float
    ) -> Optional[str]:
        """分析视频段落类型"""
        
        messages = [
            {
                "role": "user",
                "content": f"""请分析这个音乐段落的类型。

时间范围：{segment_start:.1f}s - {segment_end:.1f}s
音频特征：{json.dumps(audio_features, indent=2)}

请判断这个段落最可能是以下哪种类型：
- intro (前奏)
- verse (主歌)  
- chorus (副歌)
- bridge (桥段)
- outro (尾奏)
- instrumental (间奏)

请只返回类型名称，并简要说明判断理由。"""
            }
        ]
        
        return await self._make_request(messages)
    
    def _format_pose_data(self, pose_data: PoseFrame) -> str:
        """格式化姿态数据为文本描述"""
        keypoints_text = []
        for name, point in pose_data.keypoints.items():
            keypoints_text.append(
                f"{name}: ({point.x:.3f}, {point.y:.3f}, 置信度: {point.confidence:.3f})"
            )
        
        return f"""
帧号: {pose_data.frame_number}
时间戳: {pose_data.timestamp:.3f}s
整体置信度: {pose_data.pose_confidence:.3f}
关键点:
{chr(10).join(keypoints_text)}
"""


# 创建全局服务实例
glm_service = GLMService()
