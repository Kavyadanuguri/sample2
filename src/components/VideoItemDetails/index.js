import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import ReactPlayer from 'react-player'
import {BiLike, BiDislike, BiListPlus} from 'react-icons/bi'
import CartContext from '../../context/CartContext'
import SideBar from '../SideBar'
import Header from '../Header'

import {
  VideoDisplayContainer,
  VideoPlayer,
  VideoFailureHeading1,
  VideoP1,
  VideoP11,
  VideoContainer1,
  VideoMainContainer,
  VideoCon1,
  VideoImg1,
  VideoFailP1,
  VideoFailureContainer,
  VideoHrLine,
  VideoFailureImg,
  VideoFailButton,
  PlusButton,
} from './styledComponents'

const videoStagesList = {
  progress: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class VideoItemDetails extends Component {
  state = {
    fetchedVideoData: '',
    fetchedChannelData: '',
    videoStage: videoStagesList.progress,
  }

  componentDidMount() {
    this.getVideoData()
  }

  getVideoData = async () => {
    this.setState({videoStage: videoStagesList.progress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/videos/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const channelData = {
        name: data.video_details.channel.name,
        profileImageUrl: data.video_details.channel.profile_image_url,
        subscriberCount: data.video_details.channel.subscriber_count,
      }

      const updatedData = {
        id: data.video_details.id,
        title: data.video_details.title,
        videoUrl: data.video_details.video_url,
        thumbnailUrl: data.video_details.thumbnail_url,
        channel: {
          name: data.video_details.channel.name,
          profileImageUrl: data.video_details.channel.profile_image_url,
          subscriberCount: data.video_details.channel.subscriber_count,
        },
        viewCount: data.video_details.view_count,
        publishedAt: data.video_details.published_at,
        description: data.video_details.description,
      }
      this.setState({
        fetchedVideoData: updatedData,
        fetchedChannelData: channelData,
        videoStage: videoStagesList.success,
      })
    } else {
      this.setState({videoStage: videoStagesList.failure})
    }
  }

  renderSuccessView = () => (
    <CartContext.Consumer>
      {value => {
        const {fetchedVideoData, fetchedChannelData} = this.state
        const {
          id,
          title,
          videoUrl,
          viewCount,
          publishedAt,
          description,
        } = fetchedVideoData
        const {
          onIncrementList,
          isLightTheme,
          saveColor,
          onSaveValue,
          onLikeValue,
          likeValue,
          onDislikeValue,
          dislikeValue,
        } = value
        const back1 = !isLightTheme && '#0f0f0f'
        const text = !isLightTheme && '#ffffff'
        const saveItemColor = saveColor ? '#2563eb' : '#64748b'
        const saveItemText = saveColor ? 'Saved' : 'Save'
        const likeColor = likeValue ? '#2563eb' : '#64748b'
        const dislikeColor = dislikeValue ? '#2563eb' : '#64748b'

        const onSavedVideo = () => {
          onIncrementList(fetchedVideoData)
          onSaveValue(id)
        }

        const onLike = () => {
          onLikeValue(id)
        }

        const onDislike = () => {
          onDislikeValue(id)
        }

        return (
          <VideoMainContainer
            data-testid="videoItemDetails"
            style={{background: back1}}
            key={id}
          >
            <VideoPlayer>
              <ReactPlayer
                url={videoUrl}
                controls
                width="1020px"
                height="450px"
              />
            </VideoPlayer>
            <VideoP1 style={{color: text}}>{title}</VideoP1>
            <VideoContainer1>
              <VideoP1 value>
                {viewCount} views . {publishedAt}
              </VideoP1>

              <VideoCon1 kavya>
                <VideoCon1>
                  <PlusButton onClick={onLike} type="button">
                    <BiLike color={likeColor} size={25} />

                    <VideoP11
                      onClick={onLike}
                      style={{
                        color: likeColor,
                        fontWeight: likeValue && 'bold',
                      }}
                    >
                      Like
                    </VideoP11>
                  </PlusButton>
                </VideoCon1>
                <VideoCon1>
                  <PlusButton onClick={onDislike} type="button">
                    <BiDislike color={dislikeColor} size={25} />

                    <VideoP11
                      onClick={onDislike}
                      style={{
                        color: dislikeColor,
                        fontWeight: dislikeValue && 'bold',
                      }}
                    >
                      Dislike
                    </VideoP11>
                  </PlusButton>
                </VideoCon1>
                <VideoCon1>
                  <PlusButton onClick={onSavedVideo} type="button">
                    <BiListPlus color={saveItemColor} size={25} />

                    <VideoP11
                      onClick={onSavedVideo}
                      style={{
                        color: saveItemColor,
                        fontWeight: saveColor && 'bold',
                      }}
                    >
                      {saveItemText}
                    </VideoP11>
                  </PlusButton>
                </VideoCon1>
              </VideoCon1>
            </VideoContainer1>
            <VideoHrLine />
            <VideoContainer1 value>
              <VideoImg1
                alt="channel logo"
                src={fetchedChannelData.profileImageUrl}
              />
              <div>
                <VideoP1 style={{color: text}}>
                  {fetchedChannelData.name}
                </VideoP1>
                <VideoP1 value>
                  {fetchedChannelData.subscriberCount} subscribers
                </VideoP1>
                <VideoP1 style={{color: text}}>{description}</VideoP1>
              </div>
            </VideoContainer1>
          </VideoMainContainer>
        )
      }}
    </CartContext.Consumer>
  )

  getRequest = () => {
    this.getVideoData()
  }

  renderFailureView = () => (
    <CartContext.Consumer>
      {value => {
        const {isLightTheme} = value
        const back1 = !isLightTheme && '#000000'
        const text = !isLightTheme && '#ffffff'
        return (
          <VideoFailureContainer style={{background: back1}}>
            <VideoFailureImg
              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-dark-theme-img.png"
              alt="failure view"
            />
            <VideoFailureHeading1 style={{color: text}}>
              Oops! Something Went Wrong
            </VideoFailureHeading1>
            <VideoFailP1>
              We are having some trouble to complete your request. Please try
              again.
            </VideoFailP1>
            <VideoFailButton onClick={this.getRequest}>Retry</VideoFailButton>
          </VideoFailureContainer>
        )
      }}
    </CartContext.Consumer>
  )

  renderProgressView = props => {
    console.log(props)
    return (
      <VideoFailureContainer data-testid="loader">
        <Loader type="ThreeDots" color="blue" height="50" width="50" />
      </VideoFailureContainer>
    )
  }

  renderExactStage = () => {
    const {videoStage} = this.state
    switch (videoStage) {
      case videoStagesList.success:
        return this.renderSuccessView()
      case videoStagesList.failure:
        return this.renderFailureView()
      case videoStagesList.progress:
        return this.renderProgressView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <VideoDisplayContainer>
          <SideBar />
          {this.renderExactStage()}
        </VideoDisplayContainer>
      </>
    )
  }
}

export default VideoItemDetails
