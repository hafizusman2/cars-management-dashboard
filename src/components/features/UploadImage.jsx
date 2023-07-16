import React from 'react';
import { useState } from 'react';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { showNotification } from '@mantine/notifications';
import {
  Button,
  Grid,
  Group,
  Image,
  Input,
  Paper,
  Progress,
  SimpleGrid,
  Text,
} from '@mantine/core';
import { Upload } from 'tabler-icons-react';

const UploadImage = (props) => {
  const [refresh, setRefresh] = useState(false);
  React.useEffect(() => {
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh]);

  const previews = props.images?.map((file, index) => {
    let imageUrl;
    try {
      imageUrl = URL.createObjectURL(file);
    } catch (e) {
      imageUrl = file;
    }
    return (
      <div
        key={index}
        style={{
          alignContent: 'center',
          MozWindowDragging: 'no-drag',
          alignContent: 'center',
        }}
      >
        <div>
          <Image
            key={index}
            src={imageUrl}
            width="100%"
            height={120}
            radius={20}
            mx="auto"
            imageProps={{
              onLoad: () => URL.revokeObjectURL(imageUrl),
            }}
          />
          <Group position="center">
            <Button
              fullWidth
              mt="sm"
              size="sm"
              hidden={props.disabled1}
              compact
              color="red"
              onClick={() => {
                if (props.urls.length !== 0) {
                  if (props.indexOfCoverImageURL === index) {
                    props.setIndexOfCoverImageURL(0);
                  } else if (props.indexOfCoverImageURL > index) {
                    props.setIndexOfCoverImageURL(
                      props.indexOfCoverImageURL - 1
                    );
                  }
                } else {
                  console.log('URL LENGTH', props.urls.length);
                  props.setHidden(true);
                  props.setIndexOfCoverImageURL(null);
                }

                props.setImageURLS((mapper) =>
                  mapper.filter((_, i) => i !== index)
                );
                props.setUrls(props.urls.filter((_, i) => i !== index));
                props.setImages(props.images.filter((_, i) => i !== index));
                props.setPercentages(
                  props.percentages.filter((_, i) => i !== index)
                );
              }}
            >
              Remove
            </Button>
          </Group>
        </div>
      </div>
    );
  });

  React.useEffect(() => {
    if (props.disabled1) {
      props.setDisabled(true);
      let enable = true;

      if (enable) {
        props.setIndexOfCoverImageURL(0);
        props.setDisabled(false);
        props.setDisabled1(false);
      }
    }
  }, [props.percentages, props.urls, props.images]);

  return (
    <div>
      <Grid>
        <Grid.Col
          lg={props.hidden ? 12 : 9}
          style={{
            transition: '1s',
          }}
        >
          <Input.Wrapper error={props.error} size="lg">
            <Text weight="bold" size="xl" py="md">
              {props.addImages}
            </Text>
          </Input.Wrapper>

          <Paper>
            <Dropzone
              maxSize={4 * 1024 ** 3}
              accept={[
                MIME_TYPES.jpeg,
                MIME_TYPES.png,
                MIME_TYPES.svg,
                MIME_TYPES.gif,
              ]}
              onReject={(file) => {
                showNotification({
                  color: 'red',
                  title: `ERROR`,

                  message: `THIS FILE SIZE IS TOO LARGE OR TYPE IS NOT SUPPORTED`,
                });
              }}
              // onDrop={props.setImages}
              activateOnDrag={false}
              onDrop={(newImages) => {
                let newFilteredImages = [];
                let showDuplicateAlert = false;

                newImages?.map((newImage) => {
                  let addImage = true;
                  props.images?.map((image) => {
                    console.log('@COMPARE', newImage.path, image.path);
                    console.log('@@OLD', image);
                    console.log('@@New', newImage);
                    if (newImage.path == image.path) {
                      showDuplicateAlert = true;

                      addImage = false;
                    }
                  });
                  if (addImage) {
                    newFilteredImages.push(newImage);
                  }
                });
                if (showDuplicateAlert) {
                  showNotification({
                    color: 'yellow',
                    title: `IT'S ALREADY THERE!!`,

                    message: `DUPLICATE IMAGES HAVE NOT BEEN ADDED`,
                  });
                }
                const prevLength = props.images.length;

                props.setImages((prevImages) => [
                  ...prevImages,
                  ...newFilteredImages,
                ]);
              }}
              style={{
                height: '150px',
                backgroundColor: '#E0E0E0',
              }}
            >
              <Group>
                <Upload />
                <Text>Drop Images Here</Text>
              </Group>
            </Dropzone>

            <SimpleGrid
              cols={6}
              breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
              mt={previews.length > 0 ? 'xl' : 0}
            >
              {previews}
            </SimpleGrid>
          </Paper>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default UploadImage;
