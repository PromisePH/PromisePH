import React from 'react';
import { Skeleton, SkeletonCircle, Stack } from '@chakra-ui/react'

function PostSkeleton() {
    return (
        <Stack spacing={4}>
            <SkeletonCircle size="10" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
        </Stack>
    );
}

export default PostSkeleton;